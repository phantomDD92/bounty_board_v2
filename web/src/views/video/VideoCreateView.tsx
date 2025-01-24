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
} from "@mui/material"

import type { VideoParamType } from "@/types/valueTypes"

import { createVideo } from "@/lib/api"

import VideoPreview from '@/components/YouTubePreview'

const VideoCreateView = () => {
  const [url, setUrl] = useState('');
  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<VideoParamType>({
    defaultValues: {
      title: '',
      url: '',
      description: '',
    }
  })

  const handleFormSubmit = (data: VideoParamType) => {
    createVideo(data).then(() => {
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
              Create a new video
            </Typography>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='contained' type='submit'>Submit</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title='Video Information' />
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
                            placeholder='Enter a video title...'
                            {...(errors.title && { error: true, helperText: 'This field is required.' })}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='url'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            value={value}
                            onChange={e => { setUrl(e.target.value); onChange(e) }}
                            fullWidth
                            type='url'
                            label='URL'
                            placeholder='Enter a youtube id or url...'
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
                            placeholder='Enter a video description...'
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
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title='Video Preview' />
            <CardContent>
              <VideoPreview url={url} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </form>
  )
}

export default VideoCreateView
