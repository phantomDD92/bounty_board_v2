import { Grid } from '@mui/material'

import SocialCreatorView from '@/views/creator/social/SocialCreatorView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SocialCreatorView />
      </Grid>
    </Grid>
  )
}
