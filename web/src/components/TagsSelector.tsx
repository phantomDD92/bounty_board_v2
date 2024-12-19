// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

// Types Imports
import { useState } from 'react'
import { TagType } from '@/types/valueTypes'

export type Props = {
  title?: string,
  description?: string,
  // value?: string[],
  tags?: TagType[],
  onChange?: Function,
}

const TagsSelector = ({title, description, tags, onChange}: Props) => {
  // Props
  const [value, setValue] = useState<number[]>([])

  const handleTagClick = (tag: number) => {
    if (value.includes(tag)) {
      var index = value.indexOf(tag)
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
            key={tag.id}
            label={tag.text}
            onClick={() => handleTagClick(tag.id)}
            size='small'
            color={value.includes(tag.id) ? 'primary' : 'default'}
          />
        ))}
      </div>
    </div>
  )
}

export default TagsSelector
