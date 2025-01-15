'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Timeline from '@mui/lab/Timeline'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import { Alert, AlertTitle } from '@mui/material'
import { TimelineOppositeContent } from '@mui/lab'

// Component Imports
import TagsList from '@/components/TagsList'

// Util Imports
import { dateToString } from '@/utils/string'

// Context Imports
import { useSession } from '@/context/SessionContext'

// Lib Imports
import { getBountyDetail } from '@/lib/api'

// Type Imports
import type { BountyType, CommentType } from '@/types/valueTypes'

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
          <Typography variant='caption'>{dateToString(comment.createdAt)}</Typography>
        </div>
        <Typography className='mbe-2 text-wrap'>{comment.text}</Typography>
      </TimelineContent>
    </TimelineItem>
  )
}

type CommentEditorProps = {
  onSend: (value: string) => void
}

const CommentEditor = ({ onSend }: CommentEditorProps) => {
  const [comment, setComment] = useState<string>('')

  const handleSendClick = () => {
    onSend && onSend(comment)
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          rows={4}
          multiline
          label='Comment'
          placeholder='write text...'
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} className='flex justify-end'>
        <Button variant='contained' className='mb-8' onClick={handleSendClick}>
          <i className='ri-send-plane-line text-textPrimary mr-2' />
          Send
        </Button>
      </Grid>
    </Grid>
  )
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: BountyType
}

const BountyDetail = ({ open, setOpen, data }: Props) => {
  // States
  const [bountyData, setBountyData] = useState<BountyType | undefined>(data)
  const { session } = useSession();

  const handleClose = () => {
    setOpen(false)
  }

  const handleCommentSend = () => {

  }

  useEffect(() => {
    if (open && data) {
      getBountyDetail(data._id)
        .then(newData => {
          setBountyData(newData)
        })
        .catch(() => { })
    }
  }, [open, data])

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='lg' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-8 mb-4'>
        <div className='flex justify-between items-center mb-2'>
          <div>{bountyData?.title}</div>
        </div>
        <TagsList tags={data?.skills || []} />
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <Alert severity='info' className='bg-primaryLight mb-8'>
          <AlertTitle color='secondary'>This task is Open to Applications.</AlertTitle>
          <Typography>
            Click “I’m Interested” to express your interest to work on this task. If you’re a good fit, the task
            reviewer will assign you to the task. After being assigned, other contributors won’t be able to apply
            anymore and you will be able to start working and submit your work.
          </Typography>
        </Alert>
        <Typography dangerouslySetInnerHTML={{ __html: bountyData?.description || "" }} className='mb-4 text-wrap break-words' />
        <Button variant='contained' className='mb-8'>
          <i className='ri-shield-keyhole-line text-textPrimary mr-2' />
          I&apos;m interested
        </Button>
        {session?.isAuth && <CommentEditor onSend={handleCommentSend} />}
        <Timeline className='p-4'>
          {(bountyData?.comments || []).map((comment, index) => (
            <CommentItem key={`${index}`} comment={comment} />
          ))}
        </Timeline>
      </DialogContent>
    </Dialog>
  )
}

export default BountyDetail
