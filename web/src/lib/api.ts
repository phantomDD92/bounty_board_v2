import axios from 'axios'

export async function getSession() {
  const res = await axios.get("/api/auth/session");
  return res.data?.session;
}

export async function loginSimulate() {
  try {
    const res = await axios.post('/api/auth',
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
export async function addVideo({title, url}: {title: string, url: string}) {
  try {
    await axios.post('/api/video', {title, url});
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

export async function deleteVideo(id:string) {
  await axios.delete(`/api/video/${id}`);
}
