// MUI Imports
import Chip from '@mui/material/Chip'

import type { TagParamType } from '@/types/valueTypes'
import { getStatusName } from '@/utils/string'
import { Status } from '@/types/enumTypes'

type Props = {
  tags: TagParamType[],
  status?: number,
}

const TagsList = ({ tags, status }: Props) => {
  // Props
  return (
    <div className='flex gap-3 flex-wrap'>
      {status &&
        <Chip
          key="status"
          label={getStatusName(status)}
          size='small'
          color={status == Status.PENDING ? 'warning'
            : status == Status.OPEN ? "primary"
              : status == Status.ASSIGNED ? "success"
                : status == Status.COMPLETED ? "secondary"
                  : status == Status.DELETED ? "default"
                    : "error"}
          className='text-xs mr-2' />
      }
      {tags &&
        tags.map(tag => (
          <Chip key={tag._id} label={tag.name} size='small' color='primary' className='text-xs' />
        ))}
    </div>
  )
}

export default TagsList
