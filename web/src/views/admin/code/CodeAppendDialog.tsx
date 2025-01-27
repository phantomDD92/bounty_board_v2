'use client'

// MUI Imports
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Type Imports
import type { CodeSnippetType } from '@/types/valueTypes'

import languageData from '@/data/LanguageData'

type Props = {
  open: boolean
  onClose?: () => void
  onAppend?: (data: CodeSnippetType) => void
}

const CodeAppendDialog = ({ open, onClose, onAppend }: Props) => {
  // States
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeSnippetType>({
    defaultValues: {
      language: '',
      code: '',
    }
  })

  const handleFormSubmit = (data: CodeSnippetType) => {
    console.log(data);
    onAppend && onAppend(data)
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ language: '', code: '' })
    onClose && onClose()
  }

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))} onReset={handleReset} className='flex flex-col gap-5'>
        <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
          Append Code Snippet
        </DialogTitle>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <IconButton onClick={onClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id='language' error={Boolean(errors.language)}>
                  Language
                </InputLabel>
                <Controller
                  name='language'
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      variant='outlined'
                      label='Language'
                      fullWidth
                    >
                      {languageData().map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Controller
                name='code'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={10}
                    label='Code'
                    placeholder='Enter a code...'
                    {...(errors.code && { error: true, helperText: 'This field is required.' })}
                  />
                )}
              />
            </Grid>
            <Grid item xs={6}>
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

export default CodeAppendDialog
