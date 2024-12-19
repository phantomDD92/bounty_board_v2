const { randomBytes } = require('crypto');
const { VerusIdInterface, primitives } = require('verusid-ts-client');
const { PRIVATE_KEY, SIGNING_IADDRESS, CHAIN, API, CHAIN_IADDRESS, VERUS_URL, SERVER_URL } = process.env;

const R_ADDRESS_VERSION = 60;
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
            `${SERVER_URL}/api/verus`,
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
    console.log("Login Request Signed Correctly: ", _reso, challengeID);
    return { deepLink: retval.toWalletDeeplinkUri(), challengeID: challengeID };

  } catch (e) {
    console.log("Whoops something went wrong: ", e);
    return undefined
  }
}

export async function verifyLoginRequest(data:any) {
  const loginRequest = new primitives.LoginConsentResponse(data)
  const verifiedLogin = await VerusId.verifyLoginConsentResponse(loginRequest)
  console.log("Is login signature Verified? : ", verifiedLogin);
  const challengeID = loginRequest.decision.request.challenge.challenge_id;
  if (!verifiedLogin || registeredChallengeIDs.has(challengeID) === false) {
    return false;
  }
 // Check user is allowed to login here if only certain iaddress are allowed to login...
  const {result} = await VerusId.interface.getIdentity(loginRequest.signing_id)
  verifiedChallengeIDs.set(challengeID, {name: result.friendlyname, iaddress: loginRequest.signing_id});
  registeredChallengeIDs.delete(challengeID);
  return true;
}

export async function getLoginRequest(challengeID:string) {
  if (!verifiedChallengeIDs.has(challengeID))
    return undefined
  const data = verifiedChallengeIDs.get(challengeID)
  verifiedChallengeIDs.delete(challengeID)
  return data;
}
