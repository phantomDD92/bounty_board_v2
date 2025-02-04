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

// Component Imports
import TagsSelector from '@/components/TagsSelector'

// Type Imports
import type { TagType } from '@/types/valueTypes'
import { Status } from '@/types/enumTypes'

type Props = {
  search: string
  sort: string
  tags: TagType[],
  status: number,
  onSearchChange?: (value: string) => void,
  onStatusChange?: (value: number) => void,
  onSortChange?: (value: string) => void
  onTagsChange?: (value: any) => void
}

const BountyFilter = ({ search, sort, status, tags, onSearchChange, onSortChange, onTagsChange, onStatusChange }: Props) => {
  return (
    <Card>
      <CardHeader title='Filters' />
      <CardContent>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label='Status'
                  value={status}
                  onChange={e => {
                    onStatusChange && onStatusChange(parseInt(`${e.target.value}`))
                  }}
                >
                  <MenuItem value={Status.ALL}>Any</MenuItem>
                  <MenuItem value={Status.OPEN}>Open</MenuItem>
                  <MenuItem value={Status.ASSIGNED}>Assigned</MenuItem>
                  <MenuItem value={Status.COMPLETED}>Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
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
                  <MenuItem value='-weight -createdAt'>Default (rating first)</MenuItem>
                  <MenuItem value='-createdAt'>Creation Date (newest first)</MenuItem>
                  <MenuItem value='-deadline'>Deadline Date (closest first)</MenuItem>
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
