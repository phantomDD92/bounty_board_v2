'use client'

// MUI Imports
import {
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'

import moment from 'moment'

// Component Imports
import TagsList from '@/components/TagsList'

// Util Imports
import { dateUserToString } from '@/utils/string'

import CustomAvatar from '@/@core/components/mui/Avatar'

// Type Imports
import type { BountyType } from '@/types/valueTypes'
import { PublishStatus } from '@/types/enumTypes'

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
  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='lg' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4'>
        <div className='max-sm:is-[80%] max-sm:text-center'>{data?.title}</div>
        <Typography component='span' className='flex flex-col'>
          {dateUserToString(data?.createdAt, data?.creator.name || '')}
        </Typography>
        <TagsList tags={data?.skills || []} />
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6'>
        <Typography
          className='min-h-[250px] text-wrap break-words'
          component="pre" >
          {data?.description}
        </Typography>
        <div className='flex flex-wrap justify-start gap-6'>
          <CustomItem icon='ri-user-line' label='Reward' value={data?.reward || ''} />
          <CustomItem icon='ri-calendar-line' label='Deadline' value={moment(data?.deadline).format("MM/DD/YYYY")} />
          {data?.email != "" && <CustomItem icon='ri-calendar-line' label='Email' value={data?.email || ""} />}
          {data?.phone != "" && <CustomItem icon='ri-calendar-line' label='Phone' value={data?.phone || ""} />}
        </div>
        {data.status == PublishStatus.REJECTED && data.feedback && (
          <Alert severity='warning'>{data.feedback}</Alert>
        )}
        {data.status == PublishStatus.APPROVED && data.feedback && (
          <Alert severity='info'>{data.feedback}</Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BountyPreviewDialog
