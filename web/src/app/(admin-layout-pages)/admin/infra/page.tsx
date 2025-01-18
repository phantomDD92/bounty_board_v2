import { Grid } from '@mui/material'

import InfraAdminView from '@/views/admin/infra/InfraAdminView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <InfraAdminView />
      </Grid>
    </Grid>
  )
}
