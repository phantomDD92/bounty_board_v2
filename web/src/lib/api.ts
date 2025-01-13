import axios from 'axios'

import type { BountyParamType, BountySearchType, CodeParamType, CodeSnippetType, CodeType, InfraParamType, TagParamType, VideoParamType } from '@/types/valueTypes';

export async function getSession() {
  const res = await axios.get("/api/auth/session");

  return res.data?.session;
}

export async function loginSimulate() {
  try {
    await axios.post('/api/auth',
      { iaddress: 'iAv9tYEyNBP73aFmFyxqDPzisMLdTPAdtk', name: 'BBB.bitcoins@' }
    );
  } catch (error: any) {
    throw error;
  }
}

export async function requestLogin() {
  const res = await axios.post('/api/auth/login');

  return res.data;
}

export async function cancelLogin(challenge: string) {
  const res = await axios.delete('/api/auth/login', { data: { challenge } });

  return res.data;
}

export async function checkLogin(challenge: string) {
  const res = await axios.put('/api/auth/login', { challenge });

  return res.data?.verus;
}

export async function logoutUser() {
  await axios.delete('/api/auth/session');
}

// Video related api calls
export async function addVideo(params: VideoParamType) {
  try {
    await axios.post('/api/video', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getVideoList() {
  const resp = await axios.get('/api/video');

  return resp.data?.videos;
}

export async function deleteVideo(id: string) {
  await axios.delete(`/api/video/${id}`);
}

// Infra related api calls
export async function addInfra(params: InfraParamType) {
  await axios.post('/api/infra', params);
}

export async function updateInfra(infraId:string, params: InfraParamType) {
  await axios.put(`/api/infra/${infraId}`, params);
}

export async function getInfraList() {
  const resp = await axios.get('/api/infra');

  return resp.data?.infra;
}

export async function deleteInfra(id: string) {
  await axios.delete(`/api/infra/${id}`);
}


// Code related api calls
export async function addCode(params: CodeParamType) {
  try {
    await axios.post('/api/code', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function addCodeSnippet(code: CodeType, params: CodeSnippetType) {
  try {
    await axios.post(`/api/code/${code._id}/snippet`, params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
}

export async function getCodeList() {
  const resp = await axios.get('/api/code');

  return resp.data?.codes;
}

export async function deleteCode(id: string) {
  await axios.delete(`/api/code/${id}`);
}

// Tag related api calls
export async function addTag(params: TagParamType) {
    await axios.post('/api/tags', params);
}

export async function updateTag(tagId: string, params: TagParamType) {
  await axios.put(`/api/tags/${tagId}`, params);
}

export async function getTagList() {
  const resp = await axios.get('/api/tags');

  return resp.data?.tags;
}

export async function deleteTag(id: string) {
  await axios.delete(`/api/tags/${id}`);
}

// Bounty related apis
export async function getApprovedBountyList({ search, sort, tags, page, size }: BountySearchType) {
  const resp = await axios.get('/api/bounties', { params: { search, sort, tags: tags.join(","), page, size } });

  return resp.data?.bounties;
}

// Bounty related apis
export async function getBountyList() {
  const resp = await axios.get('/api/bounties/all');

  return resp.data?.bounties;
}

export async function getBounty(bountyId: string) {
  const resp = await axios.get(`/api/bounties/${bountyId}`);

  return resp.data?.bounty;
}

// Bounty related apis
export async function getUserBountyList() {
  const resp = await axios.get('/api/bounties/me');

  return resp.data?.bounties;
}

// Bounty related apis
export async function addBounty(params: BountyParamType) {
  await axios.post('/api/bounties', params);
}

// Bounty related apis
export async function approveBounty(bountyId: string, feedback: string) {
  await axios.post(`/api/bounties/${bountyId}/approve`, { feedback });
}

// Bounty related apis
export async function rejectBounty(bountyId: string, feedback: string) {
  await axios.post(`/api/bounties/${bountyId}/reject`, { feedback });
}

// Bounty related apis
export async function updateBounty(bountyId: string, params: BountyParamType) {
  await axios.put(`/api/bounties/${bountyId}`, params);
}


export async function checkVerus() {
  try {
    await axios.post('/api/auth/verus')
  } catch (e) {

  }
}

// User related apis
export async function getUserList() {
  const resp = await axios.get('/api/users');

  return resp.data?.users;
}