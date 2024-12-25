// MUI Imports
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'

// Types Imports
import { BountyCardProps } from '@/types/widgetTypes'
import { BountyType } from '@/types/valueTypes'
import moment from 'moment'
import TagsList from './TagsList'

const BountyCard = (props: BountyCardProps) => {
  // Props
  const { bounty } = props

  function bountyToUserDate(bounty: BountyType) {
    if (moment().diff(moment(bounty.createdAt), 'year', false) > 1) {
      return `${moment().diff(moment(bounty.createdAt), 'year', false)} years ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'year', false) == 1) {
      return `a year ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'month', false) > 1) {
      return `${moment().diff(moment(bounty.createdAt), 'month', false)} months ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'month', false) == 1) {
      return `a month ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'day', false) > 1) {
      return `${moment().diff(moment(bounty.createdAt), 'day', false)} days ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'day', false) == 1) {
      return `a day ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'hour', false) > 1) {
      return `${moment().diff(moment(bounty.createdAt), 'hour', false)} hours ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'hour', false) == 1) {
      return `a hour ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'minute', false) > 1) {
      return `${moment().diff(moment(bounty.createdAt), 'minute', false)} minutes ago by ${bounty.creator.name}`
    } else if (moment().diff(moment(bounty.createdAt), 'minute', false) == 1) {
      return `a minute ago by ${bounty.creator.name}`
    } else {
      return `${moment().diff(moment(bounty.createdAt), 'second', false)} seconds ago by ${bounty.creator.name}`
    }
  }

  function stringToColor(string: string) {
    let hash = 0
    let i

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }

    let color = '#'

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    /* eslint-enable no-bitwise */

    return color
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name)
      },
      children: `${name.split(' ')[0][0].toUpperCase()}`
    }
  }

  return (
    <div className='flex rounded bg-actionHover items-center gap-4 p-4 w-full'>
      <Avatar className='w-16 h-16' {...stringAvatar(bounty.creator.name)} />
      <div className='flex justify-between items-center grow'>
        <div className='flex flex-col justify-start items-start gap-2'>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitLineClamp: '1',
              WebkitBoxOrient: 'vertical'
            }}
          >
            {bounty.title}
          </Typography>
          <Typography fontSize='small' color='secondary'>
            {bountyToUserDate(bounty)}
          </Typography>
          <TagsList tags={bounty.skills} />
        </div>

        <div className='flex flex-col items-center gap-1'>
          <Chip
            color='primary'
            label={bounty.reward}
            variant='outlined'
          />
          {/* {bounty.reward.price && (
                    <Typography fontSize='small' color='secondary'>{`$ ${bounty.reward.price}`}</Typography>
                  )} */}
        </div>

      </div>
    </div >
  )
}

export default BountyCard
