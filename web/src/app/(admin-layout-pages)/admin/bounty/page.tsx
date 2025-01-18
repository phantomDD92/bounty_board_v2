import { Grid } from '@mui/material'

import BountyAdminView from '@/views/admin/bounty/BountyAdminView'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BountyAdminView />
      </Grid>
    </Grid>
  )
}
