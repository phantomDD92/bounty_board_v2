'use client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import LinkPreview from '@/components/LinkPreview'
import { useState, useEffect } from 'react'
import { VideoType } from '@/types/valueTypes'
import { getVideoList } from '@/lib/api'
import Link from 'next/link'
// import { getVideoList } from '@/libs/api'

type Props = {
  item: VideoType
};

const VideoCard = ({ item }: Props) => {
  return (
    <div className="video-container">
      <iframe
        src="https://www.youtube.com/watch?v=IrvXJz2WxhY"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="YouTube Video Player"
      ></iframe>
    </div>
    // <Link href={item.url} >
    // <div className='border rounded bs-full'>
    //   <div className='mli-2 mbs-2 overflow-hidden rounded'>
    //     <video className='w-full h-auto' controls>
    //       <source src="https://www.youtube.com/watch?v=IrvXJz2WxhY" type="video/mp4" />
    //     </video>
    //   </div>
    //   <div className='flex flex-col gap-2 p-5'>
    //     <Typography variant='h5'>{item.title}</Typography>
    //   </div>
    // </div>
    // </Link>
  )
}

const VideoList = () => {
  // States
  const [data, setData] = useState<VideoType[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    let newData = data || []
    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [data, page])

  useEffect(() => {
    getVideoList()
      .then(items => {
        setData(items)
      })
      .catch(() => { })
  }, [getVideoList])

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
