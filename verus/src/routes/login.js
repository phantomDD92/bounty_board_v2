const express = require('express')
const app = express()
const { VerusIdInterface, primitives } = require('verusid-ts-client');
const { randomBytes } = require('crypto');


const { PRIVATE_KEY, SIGNING_IADDRESS, CHAIN, API, CHAIN_IADDRESS, APP_URL } = process.env;

const VerusId = new VerusIdInterface(CHAIN || "VRSC", API || "https://api.verus.services");

const I_ADDRESS_VERSION = 102;

function generateChallengeID(len = 20) {
  const buf = randomBytes(len)
  const randBuf = Buffer.from(buf)
  const iaddress = primitives.toBase58Check(randBuf, I_ADDRESS_VERSION)
  return iaddress
}

module.exports = app.post("/login", async (req, res) => {

  let reply = {
    error: null,
    data: null,
    success: true
  }

  try {
    const challenge = generateChallengeID();

    VerusId.createLoginConsentRequest(
      SIGNING_IADDRESS,
      new primitives.LoginConsentChallenge({
        challenge_id: challenge,
        requested_access: [
          new primitives.RequestedPermission(primitives.IDENTITY_VIEW.vdxfid)
        ],
        redirect_uris: [
          new primitives.RedirectUri(
            `${APP_URL}/api/auth/verus`,
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
    ).then(async retval => {

      const _reso = await VerusId.verifyLoginConsentRequest(
        primitives.LoginConsentRequest.fromWalletDeeplinkUri(retval.toWalletDeeplinkUri()),
        null,
        CHAIN_IADDRESS
      )
      console.log("Login Request Signed Correctly: ", _reso, challenge);
      reply.data = { deepLink: retval.toWalletDeeplinkUri(), challenge };
      reply.success = true;
      res.status(200).send(reply);
    })

  } catch (e) {
    reply.error = e?.message ? e.message : e.error ? e.error.toString() : e;
    reply.success = false;
    res.send(reply);
    console.log("Whoops something went wrong: ", reply);
  }

});


module.exports = app.post("/verify", async (req, res) => {
  const { data } = req.body;
  try {
    const loginRequest = new primitives.LoginConsentResponse(data)
    const verifiedLogin = await VerusId.verifyLoginConsentResponse(loginRequest)
    console.log("Is login signature Verified? : ", verifiedLogin);
    if (!verifiedLogin) {
      res.status(400).send({ success: false, message: 'login signature unverified' });
      return;
    }
    const challenge = loginRequest.decision.request.challenge.challenge_id;
    const { result } = await VerusId.interface.getIdentity(loginRequest.signing_id)
    console.log("Newlogin: ", loginRequest.signing_id)
    res.send({ success: true, data: { challenge, name: result.friendlyname, iaddress: loginRequest.signing_id } });
  } catch (e) {
    console.log("Whoops something went wrong: ", e);
    res.status(400).send({ success: false, message: e?.message ? e.message : e.error ? e.error.toString() : e });
  }
});