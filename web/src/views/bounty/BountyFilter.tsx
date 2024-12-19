'use client'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TagsSelector from '@/components/TagsSelector'
import { TagType } from '@/types/valueTypes'
import { useEffect, useState } from 'react'
// import {  getTagList } from '@/libs/api'

type Props = {
  search: string
  sort: string
  onSearchChange?: Function
  onSortChange?: Function
  onTagsChange?: Function
}

const BountyFilter = ({ search, sort, onSearchChange, onSortChange, onTagsChange }: Props) => {
  const [tags, setTags] = useState<TagType[]>([])

  return (
    <Card>
      <CardHeader title='Filters' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Search'
                placeholder='search by title ...'
                value={search}
                onChange={e => {
                  onSearchChange && onSearchChange(e.target.value)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sorting</InputLabel>
                <Select
                  label='Sorting'
                  value={sort}
                  onChange={e => {
                    onSortChange && onSortChange(e.target.value)
                  }}
                >
                  <MenuItem value='-date_created'>Creation Date (newest first)</MenuItem>
                  <MenuItem value='-reward_amount'>Bounty Size (highest)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TagsSelector
                tags={tags}
                onChange={(value: any) => {
                  onTagsChange && onTagsChange(value)
                }}
              />
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

export default BountyFilter
