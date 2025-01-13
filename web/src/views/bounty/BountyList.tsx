'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import { Button, ButtonBase } from '@mui/material'

// Component Imports
import BountyCard from '@/components/BountyCard'

// Lib Imports
import { getApprovedBountyList } from '@/lib/api'

// Context Imports
import { useSession } from '@/context/SessionContext'

// Type Imports
import type { BountyType, TagType } from '@/types/valueTypes'

// Other Imports
import BountyDetail from './BountyDetailDialog'
import BountyCreateDialog from './BountyCreateDialog'


type Props = {
  search: string
  sort: string,
  tags: TagType[],
  selectedTags: string[]
}

const BountyList = ({ search, sort, tags, selectedTags }: Props) => {
  const [selected, setSelected] = useState<BountyType | undefined>()
  const [data, setData] = useState<BountyType[]>([])
  const [page, setPage] = useState(0)
  const [createShow, setCreateShow] = useState(false)
  const { session } = useSession()

  useEffect(() => {
    getApprovedBountyList({ search, sort, tags: selectedTags, page, size: 10 })
      .then(items => {
        setData(items)
      })
      .catch(() => {})
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
      <div className='flex justify-between items-center mr-4'>
        <CardHeader title='Open Bounties' subheader={`Total ${data ? data.length : 0} bounties founded`} />
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
        <BountyCreateDialog open={createShow} tags={tags} onClose={() => setCreateShow(false)} onUpdate={() => setCreateShow(false)}/>
      </CardContent>
    </Card>
  )
}

export default BountyList
