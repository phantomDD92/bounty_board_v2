'use client'

// MUI Imports
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material'

// Util Imports
import { dateUserToString } from '@/utils/string'

// Type Imports
import type { CommentType } from '@/types/valueTypes'

type Props = {
  open: boolean
  onClose?: () => void
  data: CommentType
}

const CommentPreviewDialog = ({ open, onClose, data }: Props) => {

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4'>
        <div className='max-sm:is-[80%] max-sm:text-center'>
          {`Comment for ${data?.bounty?.title}`}
        </div>
        <Typography component='span' className='flex flex-col'>
          {dateUserToString(data?.createdAt, data?.creator.name)}
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6 min-h-[300px]'>
        <IconButton onClick={onClose} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
        <Typography
          className='text-wrap break-words'
          component="pre" >
          {data?.text}
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default CommentPreviewDialog
