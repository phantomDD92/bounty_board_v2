import { BountyType,  CodeType, TagType } from "./valueTypes"

export type TagsSelectorProps = {
  title?: string,
  description?: string,
  // value?: string[],
  tags?: TagType[],
  onChange?: Function,
}

export type BountyCardProps = {
  bounty: BountyType,
}

export type CodeCardProps = {
  item : CodeType
}
