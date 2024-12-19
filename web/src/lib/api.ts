import axios from 'axios'

export async function loginUser(name: string, iaddress: string) {
  try {
    const res = await axios.post("/api/auth", { name, iaddress });

  } catch (error: any) {
    console.error(error);
  }
}
