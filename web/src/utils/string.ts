import moment from 'moment'

import { Language, Status, UserRole } from '@/types/enumTypes'

export const ensurePrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str : `${prefix}${str}`)
export const withoutSuffix = (str: string, suffix: string) =>
  str.endsWith(suffix) ? str.slice(0, -suffix.length) : str
export const withoutPrefix = (str: string, prefix: string) => (str.startsWith(prefix) ? str.slice(prefix.length) : str)

export const dateUserToString = (date: Date | undefined, username: string) => {
  if (moment().diff(moment(date), 'year', false) > 1) {
    return `${moment().diff(moment(date), 'year', false)} years ago by ${username}`
  } else if (moment().diff(moment(date), 'year', false) == 1) {
    return `a year ago by ${username}`
  } else if (moment().diff(moment(date), 'month', false) > 1) {
    return `${moment().diff(moment(date), 'month', false)} months ago by ${username}`
  } else if (moment().diff(moment(date), 'month', false) == 1) {
    return `a month ago by ${username}`
  } else if (moment().diff(moment(date), 'day', false) > 1) {
    return `${moment().diff(moment(date), 'day', false)} days ago by ${username}`
  } else if (moment().diff(moment(date), 'day', false) == 1) {
    return `a day ago by ${username}`
  } else if (moment().diff(moment(date), 'hour', false) > 1) {
    return `${moment().diff(moment(date), 'hour', false)} hours ago by ${username}`
  } else if (moment().diff(moment(date), 'hour', false) == 1) {
    return `a hour ago by ${username}`
  } else if (moment().diff(moment(date), 'minute', false) > 1) {
    return `${moment().diff(moment(date), 'minute', false)} minutes ago by ${username}`
  } else if (moment().diff(moment(date), 'minute', false) == 1) {
    return `a minute ago by ${username}`
  } else {
    return `${moment().diff(moment(date), 'second', false)} seconds ago by ${username}`
  }
}

export const dateToString = (date: Date) => {
  return moment(date).format("YYYY-MM-DD hh:mm");
}

export const dateDeltaToString = (date: Date) => {
  if (moment().diff(moment(date), 'year', false) > 1) {
    return `${moment().diff(moment(date), 'year', false)} years ago`
  } else if (moment().diff(moment(date), 'year', false) == 1) {
    return `a year ago`
  } else if (moment().diff(moment(date), 'month', false) > 1) {
    return `${moment().diff(moment(date), 'month', false)} months ago`
  } else if (moment().diff(moment(date), 'month', false) == 1) {
    return `a month ago`
  } else if (moment().diff(moment(date), 'day', false) > 1) {
    return `${moment().diff(moment(date), 'day', false)} days ago`
  } else if (moment().diff(moment(date), 'day', false) == 1) {
    return `a day ago`
  } else if (moment().diff(moment(date), 'hour', false) > 1) {
    return `${moment().diff(moment(date), 'hour', false)} hours ago`
  } else if (moment().diff(moment(date), 'hour', false) == 1) {
    return `a hour ago`
  } else if (moment().diff(moment(date), 'minute', false) > 1) {
    return `${moment().diff(moment(date), 'minute', false)} minutes ago`
  } else if (moment().diff(moment(date), 'minute', false) == 1) {
    return `a minute ago`
  } else {
    return `${moment().diff(moment(date), 'second', false)} seconds ago`
  }
}

export function getRoleName(role: number): string {
  switch (role) {
    case UserRole.NORMAL:
      return "User";
    case UserRole.SUPER:
      return "Super Admin";
    case UserRole.ADMIN:
      return "Admin";
    default:
      break
  }

  return "Unknown";
}

export function getStatusName(status: number): string {
  switch (status) {
    case Status.PENDING:
      return "Pending";
    case Status.OPEN:
      return "Open";
    case Status.REJECTED:
      return "Rejected";
    case Status.ASSIGNED:
      return "Assigned";
    case Status.COMPLETED:
      return "Closed";
    case Status.DELETED:
      return "Deleted";
    default:
      break
  }

  return "Unknown";
}

export function getStatusColor(status: number): string {
  switch (status) {
    case Status.PENDING:
      return "warning";
    case Status.OPEN:
      return "secondary";
    case Status.REJECTED:
      return "error";
    case Status.ASSIGNED:
      return "primary";
    case Status.COMPLETED:
      return "success";
    default:
      break
  }

  return "Unknown";
}

export function getLanguageLabel(language: string) {
  switch (language) {
    case Language.JAVA:
      return "Java"
    case Language.JAVASCRIPT:
      return "JavaScript";
    case Language.PYTHON:
      return "Python";
    case Language.BASH:
      return "Verus CLI";
    case Language.DOCKER:
      return "Verus GUI";
    default:
      break
  }

  return "Unknown"
}
