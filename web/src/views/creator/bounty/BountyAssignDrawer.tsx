// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Button,
  Drawer,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Select,
  Typography,
  MenuItem
} from '@mui/material'

// Third-party Imports
import { toast } from 'react-toastify'

import { assignBountyForUser,  getUserList } from '@/lib/api'

import type { BountyType, UserType } from '@/types/valueTypes'

type Props = {
  data?: BountyType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const BountyAssignDrawer = ({ data, open, onClose, onUpdate }: Props) => {

  const [users, setUsers] = useState<UserType[]>([]);
  const [assignee, setAssignee] = useState<string>();

  useEffect(() => {
    getUserList()
      .then(newData => {
        setUsers(newData)
      })
      .catch(() => { })
  }, [])

  // Handle Form Submit
  const handleAssignBounty = () => {
    if (!assignee) {
      toast.warn(`Please select user.`);

      return
    }

    if (data) {
      assignBountyForUser(data._id, assignee)
        .then(() => {
          toast.success("Bounty is assigned successfully");
          onUpdate && onUpdate()
        })
        .catch((err: any) => {
          toast.warn(err.message);
        })
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 400, sm: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Assign Bounty</Typography>
        <IconButton size='small' onClick={onClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <div>
          <FormControl fullWidth>
            <InputLabel id='assignee'>User</InputLabel>
            <Select
              value={assignee}
              onChange={e => setAssignee(e.target.value)}
              variant='outlined'
              label='Skills'

            >
              {users.map(user => (
                <MenuItem key={user._id} value={user._id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className='flex items-center gap-4 mt-5'>
          <Button variant='contained' type='submit' onClick={handleAssignBounty}>
            Assign
          </Button>
          <Button variant='outlined' color='error' type='reset' onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>

    </Drawer >
  )
}

export default BountyAssignDrawer
