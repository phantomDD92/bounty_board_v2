'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'

// Lib Imports
import { getInfraList } from '@/lib/api'

// Type Imports
import type { InfraType } from '@/types/valueTypes'

import { useSession } from '@/context/SessionContext'

const InfraListView = () => {
  // States
  const [data, setData] = useState<InfraType[]>([])
  const [page, setPage] = useState(0)
  const { session } = useSession()

  useEffect(() => {
    getInfraList()
      .then(items => {
        setData(items)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    const newData = data || []

    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [data, page])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              Find infra
            </Typography>
            <Typography>Find and explore infra of bounty board</Typography>
          </div>
          <div className='flex flex-wrap max-sm:flex-col gap-4'>
            {session?.isAuth && (
              <Button
                className='max-sm:is-full is-auto'
                variant='contained'
                href='/infra/create'
                type='submit'
                startIcon={<i className='ri-add-line' />} >
                Create Infra
              </Button>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Infra List' subheader={`Total ${data.length} infra founded`} />
          <CardContent className='flex flex-col gap-6'>
            {data.length > 0 ? (
              <Grid container spacing={6}>
                {data.slice(page * 12, page * 12 + 12).map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Link href={item.url}>
                      <div className='border rounded bs-full min-w-64 min-h-60'>
                        <div className='flex flex-col gap-4 p-5'>
                          <div className='flex flex-col gap-1'>
                            <Typography variant='h5' className='hover:text-primary mb-2'>
                              {item.title}
                            </Typography>
                            <Typography dangerouslySetInnerHTML={{ __html: item.description }} className='text-wrap break-words' />

                          </div>
                        </div>
                      </div>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography className='text-center'>No infra found</Typography>
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

export default InfraListView
