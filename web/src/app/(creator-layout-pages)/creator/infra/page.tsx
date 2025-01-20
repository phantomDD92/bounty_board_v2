import { Grid } from '@mui/material'

import InfraCreatorView from '@/views/creator/infra/InfraCreatorView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <InfraCreatorView />
      </Grid>
    </Grid>
  )
}
