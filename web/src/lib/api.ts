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
