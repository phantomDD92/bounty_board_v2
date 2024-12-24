const { randomBytes } = require('crypto');
const { VerusIdInterface, primitives } = require('verusid-ts-client');
const { PRIVATE_KEY, SIGNING_IADDRESS, CHAIN, API, CHAIN_IADDRESS, NEXT_PUBLIC_APP_URL } = process.env;

const I_ADDRESS_VERSION = 102;

const registeredChallengeIDs = new Set();
const verifiedChallengeIDs = new Map();

const VerusId = new VerusIdInterface(CHAIN, API);

function generateChallengeID(len = 20) {
  const buf = randomBytes(len)
  const randBuf = Buffer.from(buf)
  const iaddress = primitives.toBase58Check(randBuf, I_ADDRESS_VERSION)
  return iaddress
}

export async function createLoginRequest() {
  try {
    console.log(PRIVATE_KEY, SIGNING_IADDRESS);
    const challengeID = generateChallengeID();
    const retval = await VerusId.createLoginConsentRequest(
      SIGNING_IADDRESS,
      new primitives.LoginConsentChallenge({
        challenge_id: challengeID,
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid)
        ],
        redirect_uris: [
          new primitives.RedirectUri(
            `${NEXT_PUBLIC_APP_URL}/api/auth/verus`,
            primitives.LOGIN_CONSENT_WEBHOOK_VDXF_KEY.vdxfid
          ),
        ],
        subject: [],
        provisioning_info: [],
        created_at: Number((Date.now() / 1000).toFixed(0)),
      }),
      PRIVATE_KEY,
      null,
      null,
      CHAIN_IADDRESS
    );
    const _reso = await VerusId.verifyLoginConsentRequest(
      primitives.LoginConsentRequest.fromWalletDeeplinkUri(retval.toWalletDeeplinkUri()),
      null,
      CHAIN_IADDRESS
    );
    registeredChallengeIDs.add(challengeID);
    console.log("Login Request Signed Correctly: ", _reso, challengeID, registeredChallengeIDs);
    return { deepLink: retval.toWalletDeeplinkUri(), challengeID: challengeID };
  } catch (e) {
    console.log("Whoops something went wrong: ", e);
    throw e;
  }
}

export async function verifyLoginRequest(data:any) {
  const loginRequest = new primitives.LoginConsentResponse(data)
  const verifiedLogin = await VerusId.verifyLoginConsentResponse(loginRequest)
  const challengeID = loginRequest.decision.request.challenge.challenge_id;
  console.log("Is login signature Verified? : ", verifiedLogin, challengeID, registeredChallengeIDs);
  if (!verifiedLogin || registeredChallengeIDs.has(challengeID) === false) {
    return false;
  }
 // Check user is allowed to login here if only certain iaddress are allowed to login...
  const {result} = await VerusId.interface.getIdentity(loginRequest.signing_id)
  verifiedChallengeIDs.set(challengeID, {name: result.friendlyname, iaddress: loginRequest.signing_id});
  registeredChallengeIDs.delete(challengeID);
  return true;
}

export async function getLoginRequest(challenge:string) {
  if (!verifiedChallengeIDs.has(challenge))
    return undefined
  const data = verifiedChallengeIDs.get(challenge)
  verifiedChallengeIDs.delete(challenge)
  return data;
}

export async function cancelLoginRequest(challenge:string) {
  if (verifiedChallengeIDs.has(challenge)) {
    console.log("REMOVE challenge from verified list");
    verifiedChallengeIDs.delete(challenge)
  }
  if (registeredChallengeIDs.has(challenge)) {
    console.log("REMOVE challenge from registered list")
    registeredChallengeIDs.delete(challenge);
  }
}
