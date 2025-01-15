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
import { createBounty } from '@/lib/api'
import AppReactDatepicker from '@/lib/styles/AppReactDatepicker'

// Component Imports
import TiptapEditor from '@/components/TiptapEditor'

// Type Imports
import type { BountyParamType, TagType } from '@/types/valueTypes'

type Props = {
  open: boolean
  tags: TagType[]
  onClose?: () => void
  onUpdate?: () => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
    }
  }
}

const BountyCreateDialog = ({ open, tags, onClose, onUpdate }: Props) => {
  // States
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
      deadline: new Date(),
      contact: ''
    }
  })

  // Handle Form Submit
  const handleFormSubmit = async (data: BountyParamType) => {
    try {
      await createBounty(data)
      resetForm({ description: '', title: '', skills: [], reward: '', deadline: new Date(), contact: '' })
      onUpdate && onUpdate()
      toast.success('Add Bounty Success')
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const getSkillName = (skill: string) => {
    const tag = tags.find(item => item._id == skill)

    return tag?.name
  }

  // Handle Form Reset
  // const handleReset = () => {
  //   resetForm({ description: '', title: '', skills: [], reward: '', deadline: new Date(), contact: '' })
  //   onClose && onClose()
  // }

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='lg' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div>Create Bounty</div>
      </DialogTitle>
      <form onSubmit={handleSubmit(data => handleFormSubmit(data))} className='flex flex-col gap-5'>
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
                render={({ field }) => <TiptapEditor {...field} label='Description' />}
              />
            </Grid>
            <Grid item xs={6}>
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
                    MenuProps={MenuProps}
                    renderValue={(selected:any) => {
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
                    boxProps={{ className: 'is-full' }}
                    placeholderText='Deadline'
                    dateFormat={'yyyy-MM-dd'}
                    customInput={<TextField fullWidth />}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name='contact'
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Contact'
                    placeholder='abc@example.com.'
                    {...(errors.contact && { error: true, helperText: 'This field is required.' })}
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
            onClick={onClose}
            type='reset'
          >
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default BountyCreateDialog
