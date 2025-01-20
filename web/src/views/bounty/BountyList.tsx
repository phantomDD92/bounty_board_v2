'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Pagination
} from '@mui/material'

// Component Imports
import BountyCard from '@/components/BountyCard'

// Lib Imports
import { getBountyList } from '@/lib/api'

// Type Imports
import type { BountyType, TagType } from '@/types/valueTypes'

// Other Imports
import BountyDetail from './BountyDetailDialog'

type Props = {
  search: string
  sort: string,
  tags: TagType[],
  selectedTags: string[]
}

const BountyList = ({ search, sort, selectedTags }: Props) => {
  const [selected, setSelected] = useState<BountyType | undefined>()
  const [data, setData] = useState<BountyType[]>([])
  const [page, setPage] = useState(0)

  useEffect(() => {
    getBountyList({search, sort, tags:selectedTags})
      .then(items => {
        setData(items)
      })
      .catch(() => { })
  }, [search, sort, selectedTags, page])

  useEffect(() => {
    const newData = data || []

    if (page > Math.ceil(newData.length / 12)) setPage(0)
    setData(newData)
  }, [data, page])

  const handleBountyClick = (item: BountyType) => {
    setSelected(item)
  }

  return (
    <Card>
      <CardHeader title='Bounty List' subheader={`Total ${data ? data.length : 0} bounties founded`} />
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
