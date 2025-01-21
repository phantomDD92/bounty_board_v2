import moment from 'moment'

import { PublishStatus, UserRole } from '@/types/enumTypes'

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
    case PublishStatus.PENDING:
      return "Pending";
    case PublishStatus.APPROVED:
      return "Approved";
    case PublishStatus.REJECTED:
      return "Rejected";
    default:
      break
  }

  return "Unknown";
}


export function getYouTubeVideoId(input: string) {
  // Regular expression to match YouTube URLs
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|embed|shorts|watch)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

  // Regular expression to validate if the input is already a video ID
  const idRegex = /^[a-zA-Z0-9_-]{11}$/;

  if (idRegex.test(input)) {
    // Input is already a valid YouTube video ID
    return input;
  }

  const match = input.match(urlRegex);
  return match ? match[1] : ""; // Return video ID if found, otherwise null
}
