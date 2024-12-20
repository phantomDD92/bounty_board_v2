import TagListTable from '@/views/admin/tag/TagListTable'
import { Grid } from '@mui/material'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <TagListTable />
      </Grid>
    </Grid>
  )
}
