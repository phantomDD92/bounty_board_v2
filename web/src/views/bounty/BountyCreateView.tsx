"use client"

import { useEffect, useState } from 'react'

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

import type { BountyParamType, TagType } from "@/types/valueTypes"

import { createBounty, getTagList } from "@/lib/api"
import AppReactDatepicker from '@/lib/styles/AppReactDatepicker'

const BountyCreateView = () => {

  const [tags, setTags] = useState<TagType[]>([])

  const router = useRouter()

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<BountyParamType>({
    defaultValues: {
      description: '',
      title: '',
      skills: [],
      reward: '',
      deadline: undefined,
      email: '',
      phone: '',
    }
  })

  useEffect(() => {
    getTagList()
      .then(newData => {
        setTags(newData)
      })
      .catch(() => { })
  }, [])

  const handleFormSubmit = (data: BountyParamType) => {
    createBounty(data).then(() => {
      resetForm({ description: '', title: '', skills: [], reward: '', deadline: undefined, phone: '', email: '' })
      toast.success('Bounty created successfully');
      router.back()
    })
      .catch((error: any) => {
        toast.error(error.message)
      });
  }

  const getSkillName = (skill: string) => {
    const tag = tags.find(item => item._id == skill)

    return tag?.name
  }

  return (
    <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
            <Typography variant='h4' className='mbe-1'>
              Add a new bounty
            </Typography>
            <div className='flex flex-wrap max-sm:flex-col gap-4'>
              <Button variant='outlined' color='secondary' onClick={() => router.back()}>
                Cancel
              </Button>
              <Button variant='contained' type='submit' >Publish</Button>
            </div>
          </div>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader title='Bounty Information' />
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
                        placeholder='Enter a bounty title...'
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
                        minRows={10}
                        label='Description'
                        placeholder='Enter a bounty description...'
                        {...(errors.description && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='country' error={Boolean(errors.skills)}>
                      Skills
                    </InputLabel>
                    <Controller
                      name='skills'
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          multiple
                          variant='outlined'
                          label='Skills'
                          fullWidth
                          renderValue={(selected: any) => {
                            return (
                              <div className='flex flex-wrap gap-1'>
                                {(selected as unknown as string[]).map(value => (
                                  <Chip key={value} label={getSkillName(value)} size='small' />
                                ))}
                              </div>
                            )
                          }}
                        >
                          {tags.map(tag => (
                            <MenuItem key={tag._id} value={tag._id}>
                              {tag.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='reward'
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Reward'
                        placeholder='Enter a bounty reward...'
                        {...(errors.reward && { error: true, helperText: 'This field is required.' })}
                      />
                    )}
                  />

                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name='deadline'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <AppReactDatepicker
                        selected={value}
                        onChange={onChange}
                        showYearDropdown
                        showMonthDropdown
                        boxProps={{ className: 'is-full' }}
                        placeholderText='MM/DD/YYYY'
                        dateFormat={'yyyy-MM-dd'}
                        customInput={<TextField
                          value={value}
                          onChange={onChange}
                          fullWidth
                          label='Deadline'
                          {...(errors.deadline && { error: true, helperText: 'This field is required.' })}
                        />}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title='Contact Information' />
            <CardContent>
              <Grid container spacing={5} className='mbe-5'>
                <Grid item xs={12}>
                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='email'
                        label='Email'
                        placeholder='johndoe@gmail.com'
                        {...(errors.email && { error: true })}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type='tel'
                        label='Phone'
                        placeholder='(397) 294-5153'
                        {...(errors.phone && { error: true })}
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

export default BountyCreateView
