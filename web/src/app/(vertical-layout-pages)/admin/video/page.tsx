import VideoListTable from '@/views/admin/video/VideoListTable'
import { Grid } from '@mui/material'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <VideoListTable />
      </Grid>
    </Grid>
  )
}
