import moment from "moment";

import systemConfig from "@/configs/systemConfig";

import { UserRole } from "@/types/enumTypes";

export function checkAuthenticated(session: any): boolean {
  return session && session.isAuth;
}

export function checkRateLimited(session: any): boolean {
  return session?.submittedAt && moment().diff(session.submittedAt, "minute") >= systemConfig.submissionInterval
}

export function checkAdmin(session: any): boolean {
  return session?.role == UserRole.ADMIN || session?.role == UserRole.SUPER;
}

export function checkSuperAdmin(session: any): boolean {
  console.log(session?.role == UserRole.SUPER)
  return session?.role == UserRole.SUPER;
}

export function checkOwner(session: any, creatorId: string): boolean {
  return session?.userId == creatorId;
}
