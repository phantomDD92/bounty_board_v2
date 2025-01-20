'use client'

import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import { Divider, Drawer, IconButton, TextField, Typography } from '@mui/material'

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
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onCancel}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>{'Approve/Reject'}</Typography>
        <IconButton size='small' onClick={onCancel}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <TextField
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          fullWidth
          multiline
          minRows={10}
          label='Feedback'
          placeholder='Enter a feedback...'
        />
        <div className='flex items-center gap-4 mt-8'>
          <Button variant='contained' onClick={() => onApprove && onApprove(feedback)}>
            Approve
          </Button>
          <Button variant='outlined' color='error' onClick={() => onReject && onReject(feedback)}>
            Reject
          </Button>
        </div>

      </div>
    </Drawer>
  )
}

export default PublishDialog
