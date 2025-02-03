'use client'

// MUI Imports
import {
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Tab,
  Grid,
  Chip
} from '@mui/material'

import moment from 'moment'

// Component Imports
import TagsList from '@/components/TagsList'

// Util Imports
import { dateUserToString, getStatusName } from '@/utils/string'

import CustomAvatar from '@/@core/components/mui/Avatar'

// Type Imports
import { CommentType, type BountyHistoryType, type BountyType } from '@/types/valueTypes'
import { Status } from '@/types/enumTypes'
import CustomTabList from '@/@core/components/mui/TabList'
import { useEffect, useState } from 'react'
import { TabContext, TabPanel } from '@mui/lab'
import { getCommentList, getHistoryList } from '@/lib/api'
import BountyHistoryLine from '@/components/bounty/HistoryLine'
import BountyCommentLine from '@/components/bounty/CommentLine'

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
  onClose?: () => void
  data: BountyType
}

const BountyPreviewDialog = ({ open, onClose, data }: Props) => {
  const [activeTab, setActiveTab] = useState('description')
  const [history, setHistory] = useState<BountyHistoryType[]>([])
  const [comments, setComments] = useState<CommentType[]>([]);

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
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='lg' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4 mt-4'>
        <div className='flex justify-between items-center gap-6'>
          <span>{data?.title}</span>
          <Chip
            label={getStatusName(data?.status)}
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
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6 min-h-[400px]'>
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

                      {data.status == Status.REJECTED && data.feedback && (
                        <Alert severity='warning'>{data.feedback}</Alert>
                      )}
                      {data.status == Status.OPEN && data.feedback && (
                        <Alert severity='info'>{data.feedback}</Alert>
                      )}
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

export default BountyPreviewDialog
