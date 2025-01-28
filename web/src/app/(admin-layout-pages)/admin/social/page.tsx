import { Grid } from '@mui/material'

import SocialAdminView from '@/views/admin/social/SocialAdminView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <SocialAdminView />
      </Grid>
    </Grid>
  )
}
