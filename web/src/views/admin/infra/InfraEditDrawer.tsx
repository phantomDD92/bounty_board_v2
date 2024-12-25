// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { addInfra, updateInfra } from '@/lib/api'
import { toast } from 'react-toastify'
import { InfraParamType, InfraType } from '@/types/valueTypes'
import TiptapEditor from '@/components/TiptapEditor'
import { useEffect } from 'react'
// Type Imports

type Props = {
  data?: InfraType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
  // setData: (data: VideoType[]) => void
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
      description: '',
      title: '',
      url: ''
    }
  })

  useEffect(() => {
    if (open && data) {
      resetForm({
        description: data.description,
        title: data.title,
        url: data.url,
      });
    }
  }, [open, data])
  // Handle Form Submit
  const handleFormSubmit = async (params: InfraParamType) => {
    try {
      if (data) {
        await updateInfra(data._id, params);
      } else {
        await addInfra(params);
      }
      resetForm({ title: '', url: '', description: '' });
      onUpdate && onUpdate();
      toast.success(data ? `Update Infra Success`: 'Add Infra Success');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ title: '', url: '' })
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
            name='url'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='URL'
                placeholder='Enter a video url...'
                {...(errors.url && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='title'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Title'
                placeholder='Title'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Controller
            name='description'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TiptapEditor
                {...field}
                label='Description'
              />
            )}
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

export default InfraEditDrawer
