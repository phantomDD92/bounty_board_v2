// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Button,
  Drawer,
  Divider,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { changeCodeForAdmin } from '@/lib/api'

import type {
  CodeType,
  CodeParamType,
  CodeSnippetType,
} from '@/types/valueTypes'
import CodeAppendDialog from './CodeAppendDialog'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'
import { getLanguageLabel } from '@/utils/string'

type Props = {
  data?: CodeType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const CodeEditDrawer = ({ data, open, onClose, onUpdate }: Props) => {
  const [deleteShow, setDeleteShow] = useState(false);
  const [createShow, setCreateShow] = useState(false);
  const [snippets, setSnippets] = useState<CodeSnippetType[]>([])
  const [language, setLanguage] = useState('')
  const [code, setCode] = useState('');

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeParamType>({
    defaultValues: {
      title: '',
      description: '',
      weight: 1,
    }
  })

  useEffect(() => {
    if (open && data) {
      setSnippets(data.snippets || [])

      if (data.snippets && data.snippets.length > 0) {
        setLanguage(data.snippets[0].language);
        setCode(data.snippets[0].code);
      }

      resetForm({
        title: data.title,
        description: data.description,
        weight: data.weight
      });
    }
  }, [resetForm, open, data])

  const handleLanguageChange = (e: any, value: string) => {
    if (value == 'append') {
      setCreateShow(true)
    } else {
      const snippet = snippets.find(item => item.language == value)

      if (snippet) {
        setLanguage(snippet.language)
        setCode(snippet.code)
      }
    }
  }

  const handleLanguageDelete = () => {
    setDeleteShow(false);
    const newSnippets: CodeSnippetType[] = [];

    Object.assign(newSnippets, snippets)
    const snippetIndex = newSnippets.findIndex(item => item.language == language)

    if (snippetIndex >= 0) {
      newSnippets.splice(snippetIndex, 1)
      setSnippets(newSnippets)

      if (newSnippets.length > 0) {
        setLanguage(newSnippets[0].language)
        setCode(newSnippets[0].code)
      }
    }
  }

  const handleLanguageAppend = (data: CodeSnippetType) => {
    const newSnippets: CodeSnippetType[] = [];

    Object.assign(newSnippets, snippets)
    const snippetIndex = newSnippets.findIndex(item => item.language == data.language)

    if (snippetIndex >= 0) {
      toast.warn(`Code snippet for ${data.language} already existed`)

      return
    }

    setCreateShow(false);
    newSnippets.push(data)
    setSnippets(newSnippets)
    setCode(data.code)
    setLanguage(data.language)
  }


  const handleCodeChange = (e: any) => {
    const newSnippets: CodeSnippetType[] = [];

    Object.assign(newSnippets, snippets)
    const snippet = newSnippets.find(item => item.language == language)

    if (snippet) {
      snippet.code = e.target.value
      setCode(e.target.value)
      setSnippets(newSnippets)
    }
  }

  // Handle Form Submit
  const handleFormSubmit = async (params: CodeParamType) => {
    try {
      if (data) {
        await changeCodeForAdmin(data._id, { ...params, snippets });
        onUpdate && onUpdate();
        toast.success(`Code changed successfully`);
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
        <Typography variant='h5'>Edit Code</Typography>
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
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={10}
                label='Description'
                placeholder='Enter a code description...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
          <Tabs
            value={language}
            onChange={handleLanguageChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="secondary">
            <Tab
              key="append"
              value="append"
              label={
                <Button size='small'
                  startIcon={<i className='ri-add-line' />}
                >
                  Append
                </Button>
              } />
            {snippets.map(snippet => (
              <Tab
                key={snippet.language}
                value={snippet.language}
                label={<div>
                  <span>
                    {getLanguageLabel(snippet.language)}
                  </span>
                  <IconButton size='small' onClick={() => setDeleteShow(true)}>
                    <i className='ri-close-line' />
                  </IconButton>
                </div>} />
            ))}
          </Tabs>
          <TextField
            value={code}
            onChange={handleCodeChange}
            fullWidth
            multiline
            minRows={10}
            label='Code Snippet'
            placeholder='Enter a code snippet...'
            {...(errors.title && { error: true, helperText: 'This field is required.' })}
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
      <ConfirmDialog
        open={deleteShow}
        question='Are you sure to remove the language?'
        onCancel={() => setDeleteShow(false)}
        onConfirm={handleLanguageDelete}
      />
      <CodeAppendDialog
        open={createShow}
        onClose={() => setCreateShow(false)}
        onAppend={handleLanguageAppend}
      />
    </Drawer >
  )
}

export default CodeEditDrawer
