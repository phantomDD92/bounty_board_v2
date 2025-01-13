// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Types Imports
import type { TagType } from '@/types/valueTypes'

export type Props = {
  title?: string,
  description?: string,
  tags?: TagType[],
  onChange?: (value:string[]) => void,
}

const TagsSelector = ({title, description, tags, onChange}: Props) => {
  // Props
  const [value, setValue] = useState<string[]>([])

  const handleTagClick = (tag: string) => {
    if (value.includes(tag)) {
      const index = value.indexOf(tag)
      
      if (index !== -1) {
        const cloneValue = value.slice()

        cloneValue.splice(index, 1)
        setValue(cloneValue)
        onChange && onChange(cloneValue)
      }
    } else {
      setValue([...value, tag])
      onChange && onChange([...value, tag])
    }
  }

  return (
    <div>
      <Typography className='mb-3'>{title || 'Skills'}</Typography>
      {description && (
        <Typography className='mb-3' color='secondary' fontSize='small'>
          {description}
        </Typography>
      )}
      <div className='flex gap-3 flex-wrap'>
        {tags && tags.map(tag => (
          <Chip
            key={tag._id}
            label={tag.name}
            onClick={() => handleTagClick(tag._id)}
            size='small'
            color={value.includes(tag._id) ? 'primary' : 'default'}
          />
        ))}
      </div>
    </div>
  )
}

export default TagsSelector
