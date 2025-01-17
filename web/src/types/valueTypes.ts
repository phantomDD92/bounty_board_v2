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
  skills: TagParamType[],
  reward: string,
  deadline: Date,
}

export type BountyType = BountyParamType & {
  _id: string,
  status: number,
  feedback: string,
  creator: UserType,
  comments?: CommentType[],
  createdAt: Date,
  updatedAt: Date,
};

// video related
export type VideoParamType = {
  title: string,
  url: string,
}

export type VideoType = VideoParamType & {
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
}

export type FeedbackParamType = {
  feedback: string,
}

export type PublishType = {
  feedback: string,
  approve: boolean,
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
