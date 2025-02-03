'use client'

// React Imports
import { useEffect, useState } from 'react'

import moment from 'moment'
import { toast } from 'react-toastify'

// MUI Imports
import {
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Tab,
  TextField,
  Typography,
} from '@mui/material'

import {
  TabContext,
  TabPanel
} from '@mui/lab'

// Component Imports
import TagsList from '@/components/TagsList'

// Util Imports
import { dateUserToString, getStatusName } from '@/utils/string'

// Context Imports
import { useSession } from '@/context/SessionContext'

// Lib Imports
import { createComment,  getCommentList, getHistoryList } from '@/lib/api'

import CustomAvatar from '@/@core/components/mui/Avatar'
import CustomTabList from '@/@core/components/mui/TabList'

// Type Imports
import type { BountyHistoryType, BountyType, CommentType } from '@/types/valueTypes'
import { Status } from '@/types/enumTypes'

import BountyHistoryLine from '@/components/bounty/HistoryLine'
import BountyCommentLine from '@/components/bounty/CommentLine'

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
          <i className='ri-send-plane-line mr-2' />
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
  const { session } = useSession();
  const [activeTab, setActiveTab] = useState('description')
  const [history, setHistory] = useState<BountyHistoryType[]>([])
  const [comments, setComments] = useState<CommentType[]>([]);

  const handleClose = () => {
    setOpen(false)
  }

  const handleCommentSend = (comment: string) => {
    if (data) {
      createComment(data?._id, comment)
        .then(() => {
          toast.success("Comment created successfully")
        })
        .catch((error: any) => {
          toast.error(error.message)
        })
    }

  }

  useEffect(() => {
    if (data) {
      getHistoryList(data._id)
        .then(history => {
          setHistory(history)
        })
        .catch(() => { })
      getCommentList(data._id)
        .then(comments => {
          setComments(comments)
        })
        .catch(() => { })
    }
  }, [data])

  return (
    <Dialog fullWidth open={open} onClose={handleClose} maxWidth='lg' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-8 mb-4'>
        <div className='flex justify-between items-center gap-6'>
          <span>{data?.title}</span>
          <Chip
            label={getStatusName(data?.status || Status.PENDING)}
            color={data?.status == Status.PENDING ? 'warning'
              : data?.status == Status.OPEN ? "primary"
                : data?.status == Status.ASSIGNED ? "success"
                  : data?.status == Status.COMPLETED ? "secondary"
                    : "error"} />
        </div>
        <Typography component='span' className='flex flex-col mb-4'>
          {dateUserToString(data?.createdAt, data?.creator.name || '')}
        </Typography>
        <TagsList tags={data?.skills || []} />
        <div className='flex flex-wrap justify-start gap-6 mt-4'>
          <CustomItem icon='ri-user-line' label='Assignee' value={data?.assignee?.name || '-'} />
          <CustomItem icon='ri-bit-coin-line' label='Reward' value={data?.reward || ''} />
          <CustomItem icon='ri-calendar-line' label='Deadline' value={moment(data?.deadline).format("MM/DD/YYYY")} />
          {data?.email != "" && <CustomItem icon='ri-mail-line' label='Email' value={data?.email || ""} />}
          {data?.phone != "" && <CustomItem icon='ri-phone-line' label='Phone' value={data?.phone || ""} />}
        </div>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 min-h-[400px]'>
        <TabContext value={activeTab}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <CustomTabList variant='scrollable' pill='true' onChange={(e, value) => setActiveTab(value)}>
                <Tab label='Description' icon={<i className='ri-quote-text' />} iconPosition='start' value='description' />
                <Tab label='Comments' icon={<i className='ri-message-line' />} iconPosition='start' value='comment' />
                <Tab label='History' icon={<i className='ri-history-line' />} iconPosition='start' value='history' />
              </CustomTabList>
            </Grid>
            <Grid item xs={12}>
              <TabPanel value={activeTab} className='p-0'>
                {activeTab == "description" &&
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <Typography
                        className='min-h-[250px] text-wrap break-words'
                        component="pre" >
                        {data?.description}
                      </Typography>
                    </Grid>
                  </Grid>
                }
                {activeTab == "history" &&
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      <BountyHistoryLine data={history} />
                    </Grid>
                  </Grid>
                }
                {activeTab == "comment" &&
                  <Grid container spacing={6}>
                    <Grid item xs={12}>
                      {session?.isAuth &&
                        <CommentEditor onSend={handleCommentSend} />
                      }
                      <BountyCommentLine data={comments} />
                    </Grid>
                  </Grid>
                }
              </TabPanel>
            </Grid>

          </Grid>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}

export default BountyDetail
