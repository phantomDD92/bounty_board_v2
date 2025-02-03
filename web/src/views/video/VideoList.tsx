'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Pagination,
  Typography,
  Button,
  Chip
} from '@mui/material'

// Lib Imports
import { getVideoList } from '@/lib/api'

// Type Imports
import type { VideoType } from '@/types/valueTypes'

import { useSession } from '@/context/SessionContext'

import { checkAuthenticated } from '@/utils/session'
import { dateDeltaToString } from '@/utils/string'
import VideoPreview from '@/components/VideoPreview'

type Props = {
  item: VideoType
};

const VideoCard = ({ item }: Props) => {
  return (
    <Link href={item.url} target='_blank' >
      <div className='border rounded bs-full'>
        <div className='mli-2 mbs-2 overflow-hidden rounded'>
          <VideoPreview url={item.url} />
        </div>
        <div className='flex flex-col gap-2 p-5'>
          <div className='flex items-center justify-between'>
            <Chip label={item.creator.name} variant='tonal' size='small' color='primary' />
            <Typography className='font-medium mie-1'>{dateDeltaToString(item.createdAt)}</Typography>
          </div>
          <div className='flex flex-col gap-1'>
            <Typography
              variant='h5'
              component={Link}
              href={item.url}
              className='hover:text-primary'
            >
              {item.title}
            </Typography>
            <Typography>{item.description}</Typography>
          </div>
        </div>
      </div>
    </Link>
  )
}

const VideoSearchView = () => {
  // States
  const [data, setData] = useState<VideoType[]>([])
  const [page, setPage] = useState(0)
  const { session } = useSession()

  useEffect(() => {
    const newData = data || []

    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [data, page])

  useEffect(() => {
    getVideoList()
      .then(items => {
        setData(items)
      })
      .catch(() => { })
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              Find video
            </Typography>
            <Typography>Find and explore videos of bounty board</Typography>
          </div>
          <div className='flex flex-wrap max-sm:flex-col gap-4'>
            {checkAuthenticated(session) && (
              <Button
                className='max-sm:is-full is-auto'
                variant='contained'
                href='/video/create'
                type='submit'
                startIcon={<i className='ri-add-line' />} >
                Create Video
              </Button>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Video List' subheader={`Total ${data.length} videos founded`} />
          <CardContent className='flex flex-col gap-6'>
            {data.length > 0 ? (
              <Grid container spacing={6}>
                {data.slice(page * 12, page * 12 + 12).map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <VideoCard item={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography className='text-center'>No videos found</Typography>
            )}
            <div className='flex justify-center'>
              <Pagination
                count={Math.ceil(data.length / 6)}
                page={page + 1}
                showFirstButton
                showLastButton
                variant='tonal'
                color='primary'
                onChange={(e, page) => setPage(page - 1)}
              />
            </div>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

  )
}

export default VideoSearchView
