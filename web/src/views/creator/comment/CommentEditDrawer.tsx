// React Imports
import { useEffect } from 'react'

// MUI Imports
import {
  Button,
  Drawer,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { changeCommentForUser } from '@/lib/api'

import type { CommentParamsType, CommentType } from '@/types/valueTypes'

type Props = {
  data?: CommentType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const CommentEditDrawer = ({ data, open, onClose, onUpdate }: Props) => {

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CommentParamsType>({
    defaultValues: { text: '', }
  })

  useEffect(() => {
    if (open && data) {
      resetForm({ text: data.text, });
    }
  }, [resetForm, open, data])

  // Handle Form Submit
  const handleFormSubmit = async (params: CommentParamsType) => {
    try {
      if (data) {
        await changeCommentForUser(data._id, params);
        onUpdate && onUpdate();
        toast.success(`Comment changed successfully`);
      }
    } catch (error: any) {
      toast.error(error.message);
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
        <Typography variant='h5'>Edit Comment</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='text'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={5}
                label='Comment'
                placeholder='Enter a comment text...'
                {...(errors.text && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Update
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer >
  )
}

export default CommentEditDrawer
