// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { addVideo } from '@/lib/api'
import { toast } from 'react-toastify'
import { VideoType } from '@/types/valueTypes'
import { useEffect } from 'react'
// Type Imports

type Props = {
  open: boolean
  data?: VideoType,
  onClose?: () => void
  onUpdate?: () => void
  // setData: (data: VideoType[]) => void
}

type FormValues = {
  title: string
  url: string
}

const VideoEditDrawer = ({ open, data, onClose, onUpdate }: Props) => {
  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      url: ''
    }
  })

  useEffect(() => {
    if (open && data) {
      resetForm({
        title: data.title,
        url: data.url
      })
    }
  }, [open, data])

  // Handle Form Submit
  const handleFormSubmit = async (data: FormValues) => {
    addVideo(data)
      .then(() => {
        resetForm({ title: '', url: '' })
        onUpdate && onUpdate()
      })
      .catch(error => {
        toast.error(error.message)
      })
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
        <Typography variant='h5'>{data ? 'Edit Video' : 'Add Video'}</Typography>
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
                placeholder='Title'
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
                placeholder='Enter a video url...'
                {...(errors.url && { error: true, helperText: 'This field is required.' })}
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

export default VideoEditDrawer
