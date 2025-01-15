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
import CodeCreateDialog from './CodeCreateDialog'

const CodeList = () => {
  const [items, setItems] = useState<CodeType[]>([])

  // States
  const [data, setData] = useState<CodeType[]>([])
  const [page, setPage] = useState(0)
  const [createShow, setCreateShow] = useState(false)
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
    <Card>
      <div className='flex justify-between items-center mr-4'>
        <CardHeader title='Code List' subheader={`Total ${data.length} codes founded`} />
        {session?.isAuth && (
          <Button
            variant='contained'
            className='max-sm:is-full is-auto'
            onClick={() => setCreateShow(true)}
            startIcon={<i className='ri-add-line' />}
          >
            Create
          </Button>
        )}
      </div>
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
        <CodeCreateDialog
          open={createShow}
          onClose={() => setCreateShow(false)}
          onUpdate={() => setCreateShow(false)} />
      </CardContent>
    </Card>
  )
}

export default CodeList
