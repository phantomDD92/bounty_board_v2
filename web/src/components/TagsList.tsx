// MUI Imports
import Chip from '@mui/material/Chip'

import type { TagParamType } from '@/types/valueTypes'

type Props = {
  tags: TagParamType[]
}

const TagsList = ({ tags }: Props) => {
  // Props
  return (
    <div className='flex gap-3 flex-wrap'>
      {tags &&
        tags.map(tag => (
          <Chip key={tag._id} label={tag.name} size='small' color='primary' className='text-xs' />
        ))}
    </div>
  )
}

export default TagsList
