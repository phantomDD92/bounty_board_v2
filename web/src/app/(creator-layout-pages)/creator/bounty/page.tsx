import { Grid } from '@mui/material'

import BountyCreatorView from '@/views/creator/bounty/BountyCreatorView'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BountyCreatorView />
      </Grid>
    </Grid>
  )
}
