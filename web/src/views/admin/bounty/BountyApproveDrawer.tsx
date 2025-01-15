// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { toast } from 'react-toastify'

import { publishBountyForAdmin } from '@/lib/api'

import TiptapEditor from '@/components/TiptapEditor'

// Type Imports
import type { BountyType } from '@/types/valueTypes'

type Props = {
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
  data?: BountyType
}

const BountyApproveDrawer = ({ open, data, onClose, onUpdate }: Props) => {
  const [feedback, setFeedback] = useState('')

  // Handle Form Submit
  const handleApprove = async () => {
    try {
      if (data) {
        await publishBountyForAdmin(data._id, { feedback, approve: true })
        setFeedback('')
        toast.success('Approve Bounty')
        onUpdate && onUpdate()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Handle Form Submit
  const handleReject = async () => {
    try {
      if (data) {
        await publishBountyForAdmin(data._id, { feedback, approve: false })
        setFeedback('')
        toast.success('Reject Bounty')
        onUpdate && onUpdate()
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    onClose && onClose()
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Approve Bounty</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <TiptapEditor value={feedback} onChange={value => setFeedback(value)} label='Feedback' />
        <div className='flex items-center gap-4 mt-4'>
          <Button variant='contained' onClick={handleApprove}>
            Approve
          </Button>
          <Button variant='outlined' color='error' type='reset' onClick={handleReject}>
            Reject
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default BountyApproveDrawer
