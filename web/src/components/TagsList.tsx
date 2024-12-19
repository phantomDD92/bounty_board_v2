// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { useState } from 'react'
import { TagType } from '@/types/valueTypes'

type Props = {
  tags: TagType[]
}

const TagsList = ({ tags }: Props) => {
  // Props
  return (
    <div className='flex gap-3 flex-wrap'>
      {tags &&
        tags.map(tag => (
          <Chip key={tag.id} label={tag.text} size='small' className='text-xs' />
        ))}
    </div>
  )
}

export default TagsList
