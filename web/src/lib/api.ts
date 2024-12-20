import { CodeParamType, CodeSnippetType, CodeType, InfraParamType, VideoParamType } from '@/types/valueTypes';
import axios from 'axios'

export async function getSession() {
  const res = await axios.get("/api/auth/session");
  return res.data?.session;
}

export async function loginSimulate() {
  try {
    await axios.post('/api/auth',
      { iaddress: 'iKX5wGESZQFRQzhTV7dYGdsXq2o3uwyTd1', name: 'CCC.bitcoins@' }
    );
  } catch (error: any) {
    throw error;
  }
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
  try {
    await axios.post('/api/infra', params);
  } catch (error: any) {
    if (error?.response?.data?.message)
      throw new Error(error?.response?.data?.message)
    throw error;
  }
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
