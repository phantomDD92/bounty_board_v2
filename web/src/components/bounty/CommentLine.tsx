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
  Typography
} from '@mui/material'

import type { CommentType } from '@/types/valueTypes'
import { dateDeltaToString, dateToString } from '@/utils/string'

type CommentItemProps = {
  key: string
  comment: CommentType
}

const CommentItem = ({ key, comment }: CommentItemProps) => {
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
          <Typography variant='caption'>{dateDeltaToString(comment.createdAt)} ({dateToString(comment.createdAt)})</Typography>
        </div>
        <Typography className='mbe-2 text-wrap'>{comment.text}</Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

type Props = {
  data: CommentType[]
}

const BountyCommentLine = ({ data }: Props) => {
  return (
    <Timeline className='p-4'>
      {data.map((comment, index) => (
        <CommentItem key={`${index}`} comment={comment} />
      ))}
    </Timeline>
  )
}
export default BountyCommentLine
