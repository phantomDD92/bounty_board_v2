import type { BountyType,  CodeType, TagType } from "./valueTypes"

export type TagsSelectorProps = {
  title?: string,
  description?: string,
  tags?: TagType[],
  onChange?: (value:any) => void,
}

export type BountyCardProps = {
  bounty: BountyType,
}

export type CodeCardProps = {
  item : CodeType
}
