import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import {
  IconButton,
  Tooltip,
  Typography
} from '@mui/material'

import type { CommentType } from '@/types/valueTypes'
import { dateDeltaToString, dateToString } from '@/utils/string'

type CommentItemProps = {
  key: string
  comment: CommentType,
  onReport?: () => void,
}

const CommentItem = ({ key, comment, onReport }: CommentItemProps) => {
  return (
    <TimelineItem key={key}>
      <TimelineOppositeContent style={{ flex: 0 }} />
      <TimelineSeparator>
        <TimelineDot color='primary' />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
          <Typography color='text.primary' className='font-medium'>
            {comment.creator?.name}
          </Typography>
          <Typography variant='caption'>
            {dateDeltaToString(comment.createdAt)} ({dateToString(comment.createdAt)})
          </Typography>
        </div>
        <div className='flex flex-wrap items-center justify-between gap-x-2 mbe-2.5'>
          <Typography
            className='mbe-2text-wrap break-words'
            component="pre" >
            {comment.text}
          </Typography>
          <Tooltip title="Report">
            <IconButton
              size='small'
              onClick={onReport}>
              <i className='ri-flag-line text-[22px] text-error' />
            </IconButton>
          </Tooltip>
        </div>

      </TimelineContent>
    </TimelineItem>
  )
}

type Props = {
  data: CommentType[]
  onReport?: (comment: CommentType) => void
}

const BountyCommentLine = ({ data, onReport }: Props) => {
  return (
    <Timeline className='p-4'>
      {data.map((comment, index) => (
        <CommentItem key={`${index}`} comment={comment} onReport={() => onReport && onReport(comment)} />
      ))}
    </Timeline>
  )
}

export default BountyCommentLine
