'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import QRCode from 'react-qr-code'
import { Box, CircularProgress } from '@mui/material'

type LoginDialogProps = {
  open: boolean
  qrCode?: string
  loading?: boolean
  onClose: ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void) | undefined
}

const LoginDialog = ({ open, qrCode, onClose, loading }: LoginDialogProps) => {
  const [QRData, setQRData] = useState(
    'i5jtwbp6zymeay9llnraglgjqgdrffsau4://x-callback-url/i3dQmgjq8L8XFGQUrs9Gpo8zvPWqs1KMtV/?i3dQmgjq8L8XFGQUrs9Gpo8zvPWqs1KMtV=Aa4uvSgsLAWiinJ7Go12_G6zOcUB_SsBGvW4AVxk05q0TGDq2DF_n1qbbExRobYwnNAZkWro16MN8qBxfV00Et3vHSRMeg9ysAUJ8BfPPdpjudQGAUkCBYT7MgABQR-3-LuR769M0LAIDMxQl-cgyOYFukiG9H7ZGUGMha949ih-VOicpuSgVaOvaLOFtMqY7SbkpCzAX761Kttn_BBqGSnAPo-o1JwfjbV2JpOK-1fENZwBjhSOz1LC-qIqk63NVdk0Y3PJUaUF5T_uWGcAAAAAAAAAAbqJxOWocEcouGM6Y-K9sqH6R6uuAQAAAAAAAAH9XMC6IZhHkmyGV3ojVlgCp2DnGQEkaHR0cDovLzQ1LjguMTQ2LjM1OjgwMDAvdmVydXNpZGxvZ2luVnuah7FxMfbust0L3RkezkpdYDsBAQA'
  )
  // const [counter, setCounter] = useState(300)
  useEffect(() => {
    if (open && qrCode) {
      setQRData(qrCode)
    }
  }, [qrCode, open])

  // useEffect(() => {
  //   const counterInterval = setInterval(() => {
  //     console.log("$$$$ : ", counter)
  //     setCounter(counter - 1);
  //   }, 1000)
  //   return () => clearInterval(counterInterval)
  // }, [])
  const counterToTime = (value: number) => {
    console.log('### :', value)
    const min = Math.floor(value / 60)
    const sec = value % 60
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' scroll='body'>
      <DialogTitle variant='h4' className='flex gap-2 flex-col items-center sm:pbs-8 sm:pbe-8 sm:pli-8'>
        <div className='max-sm:is-[80%] max-sm:text-center'>Verus ID Login</div>
      </DialogTitle>
      <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignContent: 'center'
          }}
        >
          <div className='p-4 bg-white'>
            <div className='relative'>
              <QRCode value={QRData} />
              {loading && (
                <div className='bg-white absolute top-0 left-0 bottom-0 right-0 flex justify-center items-center opacity-50'>
                  <CircularProgress size={80} />
                </div>
              )}
            </div>
          </div>
          <Typography className='m-8'>
            {loading ? `Loading QR code...` : `Scan the QR code.`}
          </Typography>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
