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

import { changeInfraForAdmin } from '@/lib/api'

import type { InfraParamType, InfraType } from '@/types/valueTypes'

type Props = {
  data?: InfraType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const InfraEditDrawer = ({ data, open, onClose, onUpdate }: Props) => {

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<InfraParamType>({
    defaultValues: {
      title: '',
      description: '',
      url: 'string',
      weight: 1,
    }
  })

  useEffect(() => {
    if (open && data) {
      resetForm({
        title: data.title,
        description: data.description,
        url: data.url,
        weight: data.weight
      });
    }
  }, [resetForm, open, data])

  // Handle Form Submit
  const handleFormSubmit = async (params: InfraParamType) => {
    try {
      if (data) {
        await changeInfraForAdmin(data._id, params);
        onUpdate && onUpdate();
        toast.success(`Infra changed successfully`);
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
        <Typography variant='h5'>{data ? 'Edit Infra' : 'Add Infra'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Title'
                placeholder='Enter a infra title...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='url'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='URL'
                placeholder='Enter a infra url...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={10}
                label='Description'
                placeholder='Enter a infra description...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
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

export default InfraEditDrawer
