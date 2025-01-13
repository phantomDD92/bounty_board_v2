// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { MenuItem, Select } from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { addCodeSnippet } from '@/lib/api'
import { Language } from '@/lib/models/Code'

import languageData from '@/data/LanguageData'

// Type Imports
import type { CodeSnippetType, CodeType } from '@/types/valueTypes'

type Props = {
  data: CodeType
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const AddCodeSnippetDrawer = ({ data, open, onClose, onUpdate }: Props) => {
  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeSnippetType>({
    defaultValues: {
      language: '',
      code: ''
    }
  })

  // Handle Form Submit
  const handleFormSubmit = async (params: CodeSnippetType) => {
    try {
      await addCodeSnippet(data, params)
      resetForm({ language: '', code: '' })
      onUpdate && onUpdate()
      toast.success('Add Code Snippet Success')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    resetForm({ language: '', code: '' })
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
        <Typography variant='h5'>Add Code Snippet</Typography>
        <IconButton size='small' onClick={handleReset}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      <div className='p-5'>
        <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
          <Controller
            name='language'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select label='Language' {...field} error={Boolean(errors.language)} defaultValue={Language.JAVASCRIPT}>
                {languageData().map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.text}
                  </MenuItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name='code'
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                label='Code'
                rows={10}
                placeholder='Enter a code snippet...'
                {...(errors.code && { error: true, helperText: 'This field is required.' })}
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

export default AddCodeSnippetDrawer
