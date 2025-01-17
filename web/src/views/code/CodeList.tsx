'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { Button } from '@mui/material'

// Component Imports
import CodeCard from '@/components/CodeCard'

// Lib Imports
import { getCodeList } from '@/lib/api'

// Type Imports
import type { CodeType } from '@/types/valueTypes'
import { useSession } from '@/context/SessionContext'
import { checkAuthenticated } from '@/utils/session'

const CodeSearchView = () => {
  const [items, setItems] = useState<CodeType[]>([])

  // States
  const [data, setData] = useState<CodeType[]>([])
  const [page, setPage] = useState(0)
  const { session } = useSession()

  useEffect(() => {
    getCodeList()
      .then(newData => {
        setItems(newData)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    const newData = items || []

    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [items, page])

  return (
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              Find codes
            </Typography>
            <Typography>Find and explore codes of bounty board</Typography>
          </div>
          <div className='flex flex-wrap max-sm:flex-col gap-4'>
            {checkAuthenticated(session) && (
              <Button
                className='max-sm:is-full is-auto'
                variant='contained'
                href='/code/create'
                type='submit'
                startIcon={<i className='ri-add-line' />} >
                Create Code
              </Button>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Code List' subheader={`Total ${data.length} codes founded`} />
          <CardContent className='flex flex-col gap-6'>
            {data.length > 0 ? (
              <Grid container spacing={6}>
                {data.slice(page * 12, page * 12 + 12).map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <CodeCard item={item} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography className='text-center'>No codes found</Typography>
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

export default CodeSearchView
