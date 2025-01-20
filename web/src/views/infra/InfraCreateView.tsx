"use client"

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
} from "@mui/material"

import type { InfraParamType } from "@/types/valueTypes"

import { createInfra } from "@/lib/api"

const InfraCreateView = () => {

  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<InfraParamType>({
    defaultValues: {
      title: '',
      url: '',
      description: '',
    }
  })

  const handleFormSubmit = (data: InfraParamType) => {
    createInfra(data).then(() => {
      resetForm({ description: '', title: '', url: '' })
      toast.success('Infra created successfully');
      router.back()
    })
      .catch((error: any) => {
        toast.error(error.message)
      });
  }

  return (
    <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4' className='mbe-1'>
              Add a new infra
            </Typography>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='contained' type='submit'>Publish</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title='Infra Information' />
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
                        placeholder='Enter a infra title...'
                        {...(errors.title && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='url'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='url'
                        label='URL'
                        placeholder='https://app.dework.xyz/obscuro'
                        {...(errors.url && { error: true })}
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
                        minRows={10}
                        label='Description'
                        placeholder='Enter a bounty description...'
                        {...(errors.description && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
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

export default InfraCreateView
