'use client'

// MUI Imports
import { Typography, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material'

// Util Imports
import { dateUserToString } from '@/utils/string'


// Type Imports
import type { InfraType } from '@/types/valueTypes'
import { PublishStatus } from '@/types/enumTypes'

// type CustomItemProps = {
//   label: string,
//   value: string,
//   icon: string,
// }

// const CustomItem = ({ label, value, icon }: CustomItemProps) => {
//   return (
//     <div className='flex items-center gap-4'>
//       <CustomAvatar variant='rounded' skin='light' color='primary'>
//         <i className={icon} />
//       </CustomAvatar>
//       <div className='flex flex-col gap-0.5'>
//         <Typography color='text.primary'>{value}</Typography>
//         <Typography variant='caption' color='text.secondary'>
//           {label}
//         </Typography>
//       </div>
//     </div>
//   )
// }

type Props = {
  open: boolean
  onClose?: () => void
  data: InfraType
}

const BountyPreviewDialog = ({ open, onClose, data }: Props) => {

  return (
    <Dialog fullWidth open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col sm:pbs-8 sm:pbe-6 sm:pli-16 mb-4'>
        <div className='max-sm:is-[80%] max-sm:text-center'>{data?.title}</div>
        <Typography component='span' className='flex flex-col'>
          {dateUserToString(data?.createdAt, data?.creator.name)}
        </Typography>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16 flex flex-col gap-6'>
        <Typography className='min-h-[150px]'>{data?.description}</Typography>
        {data.status == PublishStatus.REJECTED && data.feedback && (
          <Alert severity='warning'>{data.feedback}</Alert>
        )}
        {data.status == PublishStatus.APPROVED && data.feedback && (
          <Alert severity='info'>{data.feedback}</Alert>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default BountyPreviewDialog
