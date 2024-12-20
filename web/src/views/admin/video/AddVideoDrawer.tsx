// React Imports
import { useState, useRef } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import FormControl from '@mui/material/FormControl'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { VideoType } from '@/types/valueTypes'

// Type Imports

type Props = {
  open: boolean
  handleClose: () => void
  dataSource: VideoType[]
  setData: (data: VideoType[]) => void
}

type FormValues = {
  title: string
  url: string
}

const AddCategoryDrawer = (props: Props) => {
  // Props
  const { open, handleClose, dataSource: dataSource, setData } = props

  // States
  const [fileName, setFileName] = useState('')
  const [category, setCategory] = useState('')
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState('')

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Handle Form Submit
  const handleFormSubmit = (data: FormValues) => {
    setData([...dataSource])
    handleReset()
  }

  // Handle Form Reset
  const handleReset = () => {
    handleClose()
    resetForm({ title: '', url: '' })
    setFileName('')
    setCategory('')
    setComment('')
    setStatus('')
  }

  // Handle File Upload
  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target

    if (files && files.length !== 0) {
      setFileName(files[0].name)
    }
  }

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Add Category</Typography>
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

export default AddCategoryDrawer
