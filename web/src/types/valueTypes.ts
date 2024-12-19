export type SkillType = {
  id: string,
  name: string,
  text: string,
};

export type UserType = {
  name: string,
};

export type SessionType = {
  name: string,
  iaddress: string,
  role: string,
  isLogged: boolean,
};

export type CommentType = {
  date_created: string,
  creator: UserType,
  text: string,
};

export type TagType = {
  id: number,
  name:string,
  text:string,
}

export type BountyType = {
  id: number,
  url: string,
  title: string,
  description: string,
  date_created: string,
  tags: TagType[],
  comments?: CommentType[],
  status?: string,
  is_auction?: boolean,
  discord?: string,
  reward_amount: number,
  reward_type: string,
  reward_token: string,
  creator: UserType,
};

export type InfraType = {
  id: number,
  date_created: Date,
  title: string,
  description: string,
  url: string,
};

export type VideoType = {
  id: number,
  url: string,
};

export type CodeSnippetType = {
  id: number,
  language: string,
  snippet: string,
};

export type CodeType = {
  id: number,
  title: string,
  description: string,
  snippets: CodeSnippetType[],
}
