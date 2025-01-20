"use client"

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'

import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Chip,
  MenuItem,
} from "@mui/material"

import type { CodeParamType, CodeSnippetType } from "@/types/valueTypes"
import { Language } from '@/types/enumTypes'

import { createCode } from "@/lib/api"


import languageData from '@/data/LanguageData'

const CodeCreateView = () => {

  const [snippets, setSnippets] = useState<CodeSnippetType[]>([])
  const [language, setLanguage] = useState(Language.JAVASCRIPT)
  const [code, setCode] = useState('')

  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<CodeParamType>({
    defaultValues: {
      description: '',
      title: '',
      snippets: [],
    }
  })

  const handleFormSubmit = (data: CodeParamType) => {
    createCode({...data, snippets}).then(() => {
      resetForm({ description: '', title: '', snippets: [] })
      toast.success('Bounty created successfully');
      router.back()
    })
      .catch((error: any) => {
        toast.error(error.message)
      });
  }

  const handleCodeSnippetAdd = () => {
    if (code == '' || language == '') {
      toast.warn('Code snippet is required')

      return
    }

    if (snippets.filter(item => item.language == language).length > 0) {
      toast.warn(`Code snippet for ${language} already existed`)

      return
    }

    const codeSnippets: CodeSnippetType[] = [];

    Object.assign(codeSnippets, snippets)
    codeSnippets.push({ language, code });
    setSnippets(codeSnippets)
  }

  const handleCodeSnippetDelete = (snippet: CodeSnippetType) => {
    const codeSnippets: CodeSnippetType[] = [];

    Object.assign(codeSnippets, snippets)
    const index = codeSnippets.findIndex(item => item.language == snippet.language)

    codeSnippets.splice(index, 1)
    setSnippets(codeSnippets)
  }

  return (
    <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4' className='mbe-1'>
              Create a new code
            </Typography>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='contained' type='submit'>Submit</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader title='Code Information' />
            <CardContent>
              <Grid container spacing={5} className='mbe-5'>
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
                        placeholder='Enter a code title...'
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={10}
                        label='Description'
                        placeholder='Enter a code description...'
                        {...(errors.description && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className='flex items-center flex-wrap gap-x-1.5'>
                    <Typography className='font-medium' color='text.primary'>
                      Code Snippets: &nbsp;
                    </Typography>
                    {snippets.map(item =>
                      <Chip
                        key={item.language}
                        label={item.language}
                        variant='filled'
                        color='primary'
                        onDelete={() => handleCodeSnippetDelete(item)}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <div className='flex justify-between items-center mr-4'>
              <CardHeader title='Add Code Snippet' />
              <Button
                variant='contained'
                onClick={handleCodeSnippetAdd}
              >
                Add
              </Button>
            </div>
            <CardContent>
              <Grid container spacing={5} className='mbe-5'>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="language">Language</InputLabel>
                    <Select label='Language' value={language} onChange={e => setLanguage(e.target.value)}>
                      {languageData().map((item, index) => (
                        <MenuItem key={index} value={item.value}>
                          {item.text}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    multiline
                    minRows={10}
                    fullWidth
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    type='text'
                    label='Code Snippet'
                    placeholder='Enter a code snippets...'
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default CodeCreateView
