'use client'
// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

type ConfirmationDialogProps = {
  data: any,
  open: boolean,
  question: string
  onCancel: () => void
  onConfirm: (data:any) => void
}

const ConfirmDialog = ({ data, open, question, onCancel, onConfirm }: ConfirmationDialogProps) => {
  // States
  return (
    <Dialog fullWidth maxWidth='xs' open={open} onClose={() => onCancel && onCancel()}>
      <DialogContent className='flex items-center flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <i className='ri-error-warning-line text-[88px] mbe-6 text-warning' />
        <Typography variant='h4'>{question}</Typography>
      </DialogContent>
      <DialogActions className='justify-around pbs-0 sm:pbe-16 sm:pli-16'>
        <Button variant='contained' onClick={() => onConfirm && onConfirm(data)}>
          Yes
        </Button>
        <Button
          variant='outlined'
          color='secondary'
          onClick={() => {
            onCancel && onCancel()
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
