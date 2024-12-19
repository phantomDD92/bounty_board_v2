'use client'
import BountyFilter from '@/views/bounty/BountyFilter'
import BountyList from '@/views/bounty/BountyList'
import Grid from '@mui/material/Grid'
import { SetStateAction, useState } from 'react'

const BountyView = () => {
  const [selectedTags, setSelectedTags] = useState<number[]>([])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState('-date_created')
  return (
    <Grid container spacing={6}>
      <Grid item xs={12} md={6} lg={4}>
        <BountyFilter
          search={search}
          sort={sort}
          onSearchChange={(value: string) => setSearch(value)}
          onSortChange={(value: SetStateAction<string>) => setSort(value)}
          onTagsChange={(tags: number[]) => setSelectedTags(tags)}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <BountyList search={search} sort={sort} selectedTags={selectedTags} />
      </Grid>
    </Grid>
  )
}

export default BountyView
