import { Grid } from '@mui/material'

import VideoAdminView from '@/views/admin/video/VideoAdminView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <VideoAdminView />
      </Grid>
    </Grid>
  )
}
