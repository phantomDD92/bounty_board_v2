import axios from 'axios';

import {
  checkChallenge,
  clearChallengeData,
  getChallengeData,
  registerChallenge,
  removeChallenge,
  setChallengeData
} from "@/lib/cache";

export async function init() {
  console.log("init");
}

export async function createLoginRequest() {
  try {
    const resp = await axios.post("http://127.0.0.1:9000/login");

    if (resp.status != 200) {
      console.error(resp.statusText);

      return
    }

    const { success, message, data } = resp.data;

    if (!success) {
      console.error(message);

      return
    }

    const { challenge, deepLink } = data;

    registerChallenge(challenge);

    return { deepLink, challengeID: challenge };
  } catch (e: any) {
    console.error(e)
    throw e;
  }
}

export async function verifyLoginRequest(payload: any) {
  try {
    const resp = await axios.post('http://localhost:9000/verify', { data: payload });

    if (resp.status != 200) {
      console.error(resp.statusText)

      return false
    }

    const { success, message, data } = resp.data;

    if (!success) {
      console.error(message);

      return false
    }

    const { challenge, name, iaddress } = data;

    if (!checkChallenge(challenge))
      return false
    setChallengeData(challenge, { name, iaddress });

    return true;
  } catch (error) {
    console.error(error)

    return false;
  }
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
