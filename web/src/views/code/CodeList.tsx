'use client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'
import { useState, useEffect } from 'react'
import { CodeType } from '@/types/valueTypes'
import CodeCard from '@/components/CodeCard'
import { getCodeList } from '@/lib/api'
// import { getCodeList } from '@/libs/api'

const CodeList = () => {
  const [items, setItems] = useState<CodeType[]>([])

  // States
  const [data, setData] = useState<CodeType[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    getCodeList()
      .then(newData => {
        setItems(newData)
      })
      .catch(() => { })
  }, [getCodeList])

  useEffect(() => {
    let newData = items || []
    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [items, page])

  return (
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
  )
}

export default CodeList
