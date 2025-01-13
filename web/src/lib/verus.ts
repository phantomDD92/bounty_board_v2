import { randomBytes } from 'crypto';

import { VerusIdInterface, primitives } from 'verusid-ts-client';

import { checkChallenge, clearChallengeData, getChallengeData, registerChallenge, removeChallenge, setChallengeData } from "@/lib/cache";

const { PRIVATE_KEY, SIGNING_IADDRESS, CHAIN, API, CHAIN_IADDRESS, NEXT_PUBLIC_APP_URL } = process.env;
const I_ADDRESS_VERSION = 102;

const VerusId = new VerusIdInterface(CHAIN || "VRSC", API || "https://api.verus.services");

function generateChallengeID(len = 20) {
  const buf = randomBytes(len)
  const randBuf = Buffer.from(buf)
  const iaddress = primitives.toBase58Check(randBuf, I_ADDRESS_VERSION)

  return iaddress
}

export async function init() {
  console.log("init");
}

export async function createLoginRequest() {
  try {
    const challengeID = generateChallengeID();

    const retval = await VerusId.createLoginConsentRequest(
      SIGNING_IADDRESS || "",
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
      undefined,
      undefined,
      CHAIN_IADDRESS
    );

    const _reso = await VerusId.verifyLoginConsentRequest(
      primitives.LoginConsentRequest.fromWalletDeeplinkUri(retval.toWalletDeeplinkUri()),
      undefined,
      CHAIN_IADDRESS
    );

    registerChallenge(challengeID);

    console.log("Login Request Signed Correctly: ", _reso, challengeID);

    return { deepLink: retval.toWalletDeeplinkUri(), challengeID: challengeID };
  } catch (e) {
    console.log("Whoops something went wrong: ", e);
    throw e;
  }
}

export async function verifyLoginRequest(data: any) {
  const loginRequest = new primitives.LoginConsentResponse(data)
  const verifiedLogin = await VerusId.verifyLoginConsentResponse(loginRequest)
  const challengeID = loginRequest.decision.request.challenge.challenge_id;

  // check in cache
  console.log("Is login signature Verified? : ", verifiedLogin, challengeID);

  if (!verifiedLogin || !checkChallenge(challengeID)) {
    return false;
  }

  // Check user is allowed to login here if only certain iaddress are allowed to login...
  const { result }: {result:any} = await VerusId.interface.getIdentity(loginRequest.signing_id)

  setChallengeData(challengeID, { name: result.friendlyname || "", iaddress: loginRequest.signing_id });

  return true;
}

export type ChallengeDataType = {
  name: string,
  iaddress: string,
}

export type LoginRequestDataType = {
  exist: boolean,
  data?: ChallengeDataType,
}

export async function getLoginRequest(challenge: string): Promise<LoginRequestDataType> {
  const data = getChallengeData(challenge)

  if (!data) {
    if (checkChallenge(challenge)) {
      return { exist: true, data: undefined }
    }

    return { exist: false, data: undefined }
  }

  removeChallenge(challenge);
  clearChallengeData(challenge);

  return { exist: true, data };
}

export async function cancelLoginRequest(challenge: string) {
  if (checkChallenge(challenge)) {
    removeChallenge(challenge)
  }

  if (getChallengeData(challenge)) {
    clearChallengeData(challenge)
  }
}
