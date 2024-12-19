import { deleteSession } from '@/lib/session'

export async function logout() {
  deleteSession();
}
