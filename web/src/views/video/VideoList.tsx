'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import { Grid, Card, CardContent, CardHeader, Pagination, Typography } from '@mui/material'

// Lib Imports
import { getVideoList } from '@/lib/api'

// Type Imports
import type { VideoType } from '@/types/valueTypes'

type Props = {
  item: VideoType
};

const VideoCard = ({ item }: Props) => {
  return (

    <Link href={item.url} >
      <div className='border rounded bs-full'>
        <div className='mli-2 mbs-2 overflow-hidden rounded'>
          <video className='w-full h-auto' controls>
            <source src={item.url} />
          </video>
        </div>
        <div className='flex flex-col gap-2 p-5'>
          <Typography variant='h5'>{item.title}</Typography>
        </div>
      </div>
    </Link>
  )
}

const VideoList = () => {
  // States
  const [data, setData] = useState<VideoType[]>([])
  const [page, setPage] = useState(0)

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
  )
}

export default VideoList
