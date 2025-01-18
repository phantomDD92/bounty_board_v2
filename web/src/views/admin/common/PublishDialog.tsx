'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { DialogTitle, TextField } from '@mui/material'

type Props = {
  open: boolean,
  onCancel: () => void
  onApprove?: (feedback: string) => void,
  onReject?: (feedback: string) => void
}

const PublishDialog = ({ open, onCancel, onApprove, onReject }: Props) => {
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    open && setFeedback('')
  }, [open])

  // States
  return (
    <Dialog fullWidth maxWidth='sm' open={open} onClose={() => onCancel && onCancel()}>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-8 sm:pbe-3 sm:pli-8'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Approve/Reject</div>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-8'>
        <TextField
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          fullWidth
          multiline
          rows={5}
          label='Feedback'
          placeholder='Enter a feedback...'
        />
      </DialogContent>
      <DialogActions className='justify-center pbs-0 sm:pbe-8 sm:pli-8'>
        <Button variant='contained' color='primary' onClick={() => onApprove && onApprove(feedback)}>
          Approve
        </Button>
        <Button variant='contained' color='error' onClick={() => onReject && onReject(feedback)}>
          Reject
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

export default PublishDialog
