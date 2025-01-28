'use client'

// MUI Imports
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Button
} from '@mui/material'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

// Lib Imports
import { createSocial } from '@/lib/api'

// Type Imports
import type { SocialParamType } from '@/types/valueTypes'

type Props = {
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const SocialCreateDialog = ({ open, onClose }: Props) => {
  // States
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<SocialParamType>({
    defaultValues: {
      title: '',
      url: ''
    }
  })

  // Handle Form Submit
  const handleFormSubmit = (data: SocialParamType) => {
    createSocial(data).then(() => {
      resetForm({ title: '', url: '' })
      onClose && onClose()
      toast.success('Social added successfully')
    }).catch((error: any) => {
      toast.error(error.message)
    })
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ title: '', url: '' })
    onClose && onClose()
  }

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div>Create Social</div>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))} onReset={handleReset} className='flex flex-col gap-5'>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Controller
                name='title'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Title'
                    placeholder='Enter a social title...'
                    {...(errors.title && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='url'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='URL'
                    placeholder='Enter a social link...'
                    {...(errors.title && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            type='reset'
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default SocialCreateDialog
