'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid'

// Lib Imports
import { getTagList } from '@/lib/api'

// View Imports
import BountyFilter from '@/views/bounty/BountyFilter'
import BountyList from '@/views/bounty/BountyList'

// Type Imports
import type { TagType } from '@/types/valueTypes'

const BountyView = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState('-date_created')
  const [tags, setTags] = useState<TagType[]>([])

  useEffect(() => {
    getTagList()
      .then(newData => {
        setTags(newData)
      })
      .catch(() => { })
  }, [])

  return (
    <Grid container spacing={6}>
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
