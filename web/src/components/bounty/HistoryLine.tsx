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

import type { BountyHistoryType } from '@/types/valueTypes'
import { dateDeltaToString, dateToString } from '@/utils/string'

type HistoryItemProps = {
  key: string
  history: BountyHistoryType
}

const HistoryItem = ({ key, history }: HistoryItemProps) => {
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
            {history.creator?.name}
          </Typography>
          <Typography variant='caption'>{dateDeltaToString(history.createdAt)} ({dateToString(history.createdAt)})</Typography>
        </div>
        <Typography className='mbe-2 text-wrap'>{history.text}</Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

type Props = {
  data: BountyHistoryType[]
}

const BountyHistoryLine = ({ data }: Props) => {
  return (
    <Timeline className='p-4'>
      {data.map((history, index) => (
        <HistoryItem key={`${index}`} history={history} />
      ))}
    </Timeline>
  )
}

export default BountyHistoryLine
