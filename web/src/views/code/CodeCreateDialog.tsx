'use client'

// MUI Imports
import {
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@mui/material'
import Button from '@mui/material/Button'

// Third-party Imports
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

// Lib Imports
import { createCode } from '@/lib/api'

// Type Imports
import type { CodeParamType } from '@/types/valueTypes'

import TiptapEditor from '@/components/TiptapEditor'

type Props = {
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const CodeCreateDialog = ({ open, onClose }: Props) => {
  // States
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeParamType>({
    defaultValues: {
      title: '',
      description: '',
      snippets: [],
    }
  })

  // Handle Form Submit
  const handleFormSubmit = (data: CodeParamType) => {
    createCode(data).then(() => {
      resetForm({ title: '', description: '', snippets: [] })
      onClose && onClose()
      toast.success('Infra submitted successfully')
    }).catch((error: any) => {
      toast.error(error.message)
    })
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ title: '', description: '', snippets: [] })
    onClose && onClose()
  }

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div>Create Code</div>
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
                    placeholder='Enter a video title...'
                    {...(errors.title && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='description'
                control={control}
                rules={{ required: true }}
                render={({ field }) => <TiptapEditor {...field} label='Description' />}
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

export default CodeCreateDialog
