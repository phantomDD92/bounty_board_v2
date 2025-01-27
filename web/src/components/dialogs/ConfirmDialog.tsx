'use client'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { IconButton } from '@mui/material'

type ConfirmationDialogProps = {
  data?: any,
  open: boolean,
  question: string
  onCancel: () => void
  onConfirm: (data: any) => void
}

const ConfirmDialog = ({ data, open, question, onCancel, onConfirm }: ConfirmationDialogProps) => {
  // States
  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={() => onCancel && onCancel()}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <IconButton onClick={onCancel} className='absolute block-start-4 inline-end-4'>
          <i className='ri-close-line text-textSecondary' />
        </IconButton>
        <i className='ri-error-warning-line text-[60px] mbe-6 text-warning' />
        <Typography variant='h5'>{question}</Typography>
      </DialogContent>
      <DialogActions className='justify-around pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={() => onConfirm && onConfirm(data)}>
          Yes
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={onCancel}>
          No
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
