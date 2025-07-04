'use client'

// MUI Imports
import {
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'

// Util Imports
import { dateUserToString } from '@/utils/string'

// Type Imports
import type { InfraType } from '@/types/valueTypes'
import { Status } from '@/types/enumTypes'
import VideoPreview from '@/components/VideoPreview';

type Props = {
  open: boolean
  onClose?: () => void
  data: InfraType
}

const SocialPreviewDialog = ({ open, onClose, data }: Props) => {

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4'>
        <div className='max-sm:is-[80%] max-sm:text-center'>
          {data?.title}
        </div>
        <Typography component='span' className='flex flex-col'>
          {dateUserToString(data?.createdAt, data?.creator.name)}
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6'>
        <Typography
          className='text-wrap break-words'
          component="pre" >
          {data?.description}
        </Typography>
        <VideoPreview url={data.url} />
        {data.status == Status.REJECTED && data.feedback && (
          <Alert severity='warning'>{data.feedback}</Alert>
        )}
        {data.status == Status.OPEN && data.feedback && (
          <Alert severity='info'>{data.feedback}</Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SocialPreviewDialog
