import { Grid } from '@mui/material'

import VideoCreatorView from '@/views/creator/video/VideoCreatorView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <VideoCreatorView />
      </Grid>
    </Grid>
  )
}
