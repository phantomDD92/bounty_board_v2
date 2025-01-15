// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Lib Imports
import { createTagForAdmin, updateTagForAdmin } from '@/lib/api'

// Type Imports
import type { TagParamType, TagType } from '@/types/valueTypes'

type Props = {
  open: boolean
  data?: TagType
  onClose?: () => void
  onUpdate?: () => void
}


const TagEditDrawer = ({ open, data, onClose, onUpdate }: Props) => {
  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<TagParamType>({
    defaultValues: {
      _id: '',
      name: ''
    }
  })

  useEffect(() => {
    if (open && data) {
      resetForm({
        _id: data._id,
        name: data.name
      })
    }
  }, [resetForm, open, data])

  // Handle Form Submit
  const handleFormSubmit = async (params: TagParamType) => {
    if (data) {
      updateTagForAdmin(params._id, params)
        .then(() => {
          toast.success('Update tag successfully')
          resetForm({ _id: '', name: '' })
          onUpdate && onUpdate()
        })
        .catch(error => {
          toast.error(error.message)
        })
    } else {
      createTagForAdmin(params)
        .then(() => {
          resetForm({ _id: '', name: '' })
          onUpdate && onUpdate()
        })
        .catch(error => {
          toast.error(error.message)
        })
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ _id: '', name: '' })
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
        <Typography variant='h5'>{data ? 'Edit Tag' : 'Add Tag'}</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='_id'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                disabled={data != undefined}
                fullWidth
                label='ID'
                placeholder='Enter a tag ID...'
                {...(errors._id && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='name'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Name'
                placeholder='Enter a tag name...'
                {...(errors.name && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              {data ? 'Update' : 'Add'}
            </Button>
            <Button variant='outlined' color='error' type='reset' onClick={handleReset}>
              Discard
            </Button>
          </div>
        </form>
      </div>
    </Drawer>
  )
}

export default TagEditDrawer
