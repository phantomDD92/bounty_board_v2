'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import {
  Button,
  Grid,
  Typography
} from '@mui/material'

// Lib Imports
import { getTagList } from '@/lib/api'

// View Imports
import BountyFilter from '@/views/bounty/BountyFilter'
import BountyList from '@/views/bounty/BountyList'

// Type Imports
import type { TagType } from '@/types/valueTypes'

import { checkAuthenticated } from '@/utils/session'
import { useSession } from '@/context/SessionContext'

const BountyView = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState('-createdAt')
  const [tags, setTags] = useState<TagType[]>([])
  const { session } = useSession()

  useEffect(() => {
    getTagList()
      .then(newData => {
        setTags(newData)
      })
      .catch(() => { })
  }, [])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
          <div>
            <Typography variant='h4' className='mbe-1'>
              Find bounties
            </Typography>
            <Typography>Find and explore bounties of bounty board</Typography>
          </div>
          <div className='flex flex-wrap max-sm:flex-col gap-4'>
            {checkAuthenticated(session) && (
              <Button
                className='max-sm:is-full is-auto'
                variant='contained'
                href='/bounty/create'
                type='submit'
                startIcon={<i className='ri-add-line' />} >
                Create Bounty
              </Button>
            )}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <BountyFilter
          search={search}
          sort={sort}
          tags={tags}
          onSearchChange={(value: string) => setSearch(value)}
          onSortChange={(value: string) => setSort(value)}
          onTagsChange={(tags: string[]) => setSelectedTags(tags)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <BountyList search={search} sort={sort} tags={tags} selectedTags={selectedTags} />
      </Grid>
    </Grid>
  )
}

export default BountyView
