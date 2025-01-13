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

import { addCode } from '@/lib/api'

import TiptapEditor from '@/components/TiptapEditor'

// Type Imports
import type { CodeParamType } from '@/types/valueTypes'

type Props = {
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const AddCodeDrawer = ({ open, onClose, onUpdate }: Props) => {
  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeParamType>({
    defaultValues: {
      description: '',
      title: '',
    }
  })

  // Handle Form Submit
  const handleFormSubmit = async (data: CodeParamType) => {
    try {
      await addCode(data);
      resetForm({ title: '', description: '' })
      onUpdate && onUpdate()
      toast.success('Add Code Success')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ title: '', description: '' })
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
        <Typography variant='h5'>Add Code</Typography>
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
                placeholder='Enter a code title...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => <TiptapEditor {...field} label='Description' />}
          />
          <div className='flex items-center gap-4'>
            <Button variant='contained' type='submit'>
              Add
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

export default AddCodeDrawer
