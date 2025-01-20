'use client'

// MUI Imports
import {
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  ButtonGroup,
  Button,
  Popper,
  Grow,
  Paper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material'

// Util Imports
import { dateUserToString } from '@/utils/string'


// Type Imports
import type { CodeSnippetType, CodeType } from '@/types/valueTypes'
import CustomAvatar from '@/@core/components/mui/Avatar'
import { PublishStatus } from '@/types/enumTypes'
import { SyntheticEvent, useRef, useState } from 'react'
import { CopyBlock, railscast } from 'react-code-blocks';

type CustomItemProps = {
  label: string,
  value: string,
  icon: string,
}

const CustomItem = ({ label, value, icon }: CustomItemProps) => {
  return (
    <div className='flex items-center gap-4'>
      <CustomAvatar variant='rounded' skin='light' color='primary'>
        <i className={icon} />
      </CustomAvatar>
      <div className='flex flex-col gap-0.5'>
        <Typography color='text.primary'>{value}</Typography>
        <Typography variant='caption' color='text.secondary'>
          {label}
        </Typography>
      </div>
    </div>
  )
}


type Props = {
  open: boolean
  onClose?: () => void
  data: CodeType
}

const CodePreviewDialog = ({ open, onClose, data }: Props) => {

  const [selected, setSelected] = useState('')

  const getCodeForLanguage = (language: string):string => {
    const results = (data?.snippets || []).filter(snippet => snippet.language == language)
    return results.length > 0 ? results[0].code : ""
  }

  console.log("### : ", getCodeForLanguage(selected))
  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4'>
        <div className='max-sm:is-[80%] max-sm:text-center'>{data?.title}</div>
        <Typography component='span' className='flex flex-col'>
          {dateUserToString(data?.createdAt, data?.creator?.name || "")}
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6 min-h-[500px]'>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={6}>
            <Typography className='min-h-[150px]'>{data?.description}</Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='flex flex-col gap-2'>
            {data.snippets && data.snippets.length > 0 && (
              <FormControl size='small' className='min-is-[175px]'>
                <InputLabel id='status-select'>Language</InputLabel>
                <Select
                  id='select-status'
                  value={selected}
                  onChange={e => setSelected(e.target.value)}
                  label='Status'
                  labelId='status-select'
                >
                  {data.snippets.map(snippet =>
                    <MenuItem value={snippet.language}>{snippet.language}</MenuItem>
                  )}
                </Select>
              </FormControl>
            )}
            <CopyBlock
              language={selected}
              text={getCodeForLanguage(selected)}
              showLineNumbers={true}
              wrapLongLines={true}
              theme={railscast}
            />
          </Grid>
          <Grid item xs={12}>
            {data.status == PublishStatus.REJECTED && data.feedback && (
              <Alert severity='warning'>{data.feedback}</Alert>
            )}
            {data.status == PublishStatus.APPROVED && data.feedback && (
              <Alert severity='info'>{data.feedback}</Alert>
            )}
          </Grid>
        </Grid>

      </DialogContent>
    </Dialog>
  )
}
export default CodePreviewDialog
