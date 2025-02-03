export type SkillType = {
  id: string,
  name: string,
  text: string,
};

export type UserType = {
  _id: string,
  name: string,
  iaddress: string,
  role: number,
  createdAt: Date,
};

export type CommentParamsType = {
  text: string,
};

export type CommentType = CommentParamsType & {
  _id: string,
  createdAt: Date,
  updatedAt: Date,
  creator: UserType,
};

export type TagParamType = {
  _id: string,
  name: string,
}

export type TagType = TagParamType & {
  createdAt: Date,
  updatedAt: Date,
}

export type ContactType = {
  email?: string
  phone?: string
}
export type BountyParamType = ContactType & {
  title: string,
  description: string,
  skills: string[],
  reward: string,
  deadline: Date,
  weight?: number,
}

export type BountyType = {
  _id: string,
  title: string,
  description: string,
  skills: TagType[],
  reward: string,
  deadline: Date,
  weight?: number,
  status: number,
  feedback: string,
  creator: UserType,
  assignee?: UserType,
  comments?: CommentType[],
  email?: string
  phone?: string
  createdAt: Date,
  updatedAt: Date,
};

// video related
export type VideoParamType = {
  title: string,
  description: string,
  url: string,
  weight?: number,
}

export type VideoType = VideoParamType & {
  _id: string,
  status: number,
  feedback: string,
  creator: UserType,
  createdAt: Date,
  updatedAt: Date,
};

// video related
export type SocialParamType = {
  title: string,
  description: string,
  url: string,
  weight?: number,
}

export type SocialType = SocialParamType & {
  _id: string,
  status: number,
  feedback: string,
  creator: UserType,
  createdAt: Date,
  updatedAt: Date,
};

export type SessionType = {
  isAuth: boolean,
  userId: string,
  name: string,
  iaddress: string
  role: number,
  submittedAt: Date,
}

export type InfraParamType = {
  title: string,
  description: string,
  url: string,
  weight?: number,
}

export type FeedbackParamType = {
  feedback: string,
}

export type PublishType = {
  feedback: string,
  status: number,
}

export type InfraType = InfraParamType & {
  _id: string,
  status: number,
  feedback: string,
  creator: UserType,
  createdAt: Date,
  updatedAt: Date,
};

export type CodeSnippetType = {
  language: string,
  code: string,
};

export type CodeParamType = {
  title: string,
  description: string,
  snippets?: CodeSnippetType[],
  weight?: number,
}

export type CodeType = CodeParamType & {
  _id: string,
  status: number,
  feedback: string,
  creator: UserType,
  createdAt: Date,
  updatedAt: Date,
};

export type BountySearchType = {
  search: string,
  tags: string[],
  sort: string,
  page: number,
  size: number,
}
