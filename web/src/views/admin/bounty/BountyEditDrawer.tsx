// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Button,
  Chip,
  Drawer,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  Select,
  TextField,
  Typography,
  MenuItem
} from '@mui/material'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

import { changeBountyForAdmin, getTagList } from '@/lib/api'

import type { BountyParamType, BountyType, TagType } from '@/types/valueTypes'
import AppReactDatepicker from '@/lib/styles/AppReactDatepicker'

type Props = {
  data?: BountyType,
  open: boolean
  onClose?: () => void
  onUpdate?: () => void
}

const BountyEditDrawer = ({ data, open, onClose, onUpdate }: Props) => {

  const [tags, setTags] = useState<TagType[]>([]);

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<BountyParamType>({
    defaultValues: {
      title: '',
      description: '',
      reward: '',
      skills: [],
      phone: '',
      email: '',
      deadline: new Date(),
      weight: 1,
    }
  })

  useEffect(() => {
    getTagList()
      .then(newData => {
        setTags(newData)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (open && data) {
      resetForm({
        title: data.title,
        description: data.description,
        reward: data.reward,
        skills: data.skills? data.skills.map(skill => skill._id) : [],
        phone: data.phone,
        email: data.email,
        deadline: data.deadline,
        weight: data.weight
      });
    }
  }, [resetForm, open, data])

  // Handle Form Submit
  const handleFormSubmit = async (params: BountyParamType) => {
    try {
      if (data) {
        await changeBountyForAdmin(data._id, params);
        onUpdate && onUpdate();
        toast.success(`Bounty changed successfully`);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  // Handle Form Reset
  const handleReset = () => {
    onClose && onClose()
  }

  const getSkillName = (skill: string) => {
    const tag = tags.find(item => item._id == skill)

    return tag?.name
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
        <Typography variant='h5'>{data ? 'Edit Infra' : 'Add Infra'}</Typography>
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
                placeholder='Enter a bounty title...'
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
                placeholder='Enter a bounty description...'
                {...(errors.title && { error: true, helperText: 'This field is required.' })}
              />
            )}
          />
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
    </Drawer >
  )
}

export default BountyEditDrawer
