'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'

// Type Imports
import { BountyType } from '@/types/valueTypes'
import BountyCard from '@/components/BountyCard'
import { ButtonBase } from '@mui/material'
import BountyDetail from './BountyDetail'
// import { getBountyList } from '@/libs/api'

type Props = {
  search: string,
  sort: string,
  selectedTags: number[]
}

const BountyList = ({search, sort, selectedTags}: Props) => {
  const [selected, setSelected] = useState<BountyType | undefined>()
  const [data, setData] = useState<BountyType[]>([])
  const [page, setPage] = useState(0)

  // useEffect(() => {
  //   getBountyList({search, sort, selectedTags})
  //     .then(items => {
  //       setData(items)
  //     })
  //     .catch(() => {})
  // }, [getBountyList, search, sort, selectedTags])

  useEffect(() => {
    let newData = data || []
    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [data, page])

  const handleBountyClick = (item: BountyType) => {
    setSelected(item)
  }

  return (
    <Card>
      <CardHeader title='Open Bounties' subheader={`Total ${data ? data.length : 0} bounties founded`} />
      <CardContent className='flex flex-col gap-6'>
        <Grid item xs={12} md={12} className='flex flex-col gap-6'>
          {data &&
            data.map((item: BountyType, index: number) => (
              <Card key={index}>
                <ButtonBase className='w-full border-2 border-indigo-700' onClick={() => handleBountyClick(item)}>
                  <BountyCard bounty={item} />
                </ButtonBase>
              </Card>
            ))}
        </Grid>
        {data.length > 6 && (
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
        )}

        <BountyDetail open={selected != null} setOpen={() => setSelected(undefined)} data={selected} />
      </CardContent>
    </Card>
  )
}

export default BountyList
