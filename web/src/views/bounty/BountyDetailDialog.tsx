'use client'

// React Imports
import { useEffect, useState } from 'react'

import moment from 'moment'

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
import { TimelineOppositeContent } from '@mui/lab'

// Component Imports
import TagsList from '@/components/TagsList'

// Util Imports
import { dateToString, dateUserToString } from '@/utils/string'

// Context Imports
import { useSession } from '@/context/SessionContext'

// Lib Imports
import { createComment, getBountyDetail } from '@/lib/api'

// Type Imports
import type { BountyType, CommentType } from '@/types/valueTypes'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { toast } from 'react-toastify'

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

type CustomItemProps = {
  label: string,
  value: string,
  icon: string,
}

const CustomItem = ({ label, value, icon }: CustomItemProps) => {
  return (
    <div className='flex items-center gap-4'>
      <CustomAvatar variant='rounded' skin='light' color='primary'>
        <i className={icon} />
      </CustomAvatar>
      <div className='flex flex-col gap-0.5'>
        <Typography color='text.primary'>{value}</Typography>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
      </div>
    </div>
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

  const handleCommentSend = (comment: string) => {
    if (data) {
      createComment(data?._id, comment)
        .then(() => {
          toast.success("Comment created successfully")
          getBountyDetail(data._id)
            .then(newData => {
              setBountyData(newData)
            })
            .catch(() => { })
        })
        .catch((error: any) => {
          toast.error(error.message)
        })
    }

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
        <div className='flex justify-between items-center mb-1'>
          <div>{data?.title}</div>
        </div>
        <Typography component='span' className='flex flex-col mb-2'>
          {dateUserToString(data?.createdAt, data?.creator.name || '')}
        </Typography>
        <TagsList tags={data?.skills || []} />
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        {/* <Alert severity='info' className='bg-primaryLight mb-8'>
          <AlertTitle color='secondary'>This task is Open to Applications.</AlertTitle>
          <Typography>
            Click “I’m Interested” to express your interest to work on this task. If you’re a good fit, the task
            reviewer will assign you to the task. After being assigned, other contributors won’t be able to apply
            anymore and you will be able to start working and submit your work.
          </Typography>
        </Alert> */}
        <Typography
          className='min-h-[250px] text-wrap break-words'
          component="pre" >
          {data?.description}
        </Typography>
        <div className='flex flex-wrap justify-start gap-6 mt-8 mb-8'>
          <CustomItem icon='ri-user-line' label='Reward' value={data?.creator.name || ''} />
          <CustomItem icon='ri-calendar-line' label='Deadline' value={moment(data?.deadline).format("MM/DD/YYYY")} />
          {data?.email != "" && <CustomItem icon='ri-calendar-line' label='Email' value={data?.email || ""} />}
          {data?.phone != "" && <CustomItem icon='ri-calendar-line' label='Phone' value={data?.phone || ""} />}
        </div>
        {/* <Button variant='contained' className='mb-8'>
          <i className='ri-shield-keyhole-line text-textPrimary mr-2' />
          I&apos;m interested
        </Button> */}
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
