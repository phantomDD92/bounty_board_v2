import { Grid } from '@mui/material'

import CodeAdminView from '@/views/admin/code/CodeAdminView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CodeAdminView />
      </Grid>
    </Grid>
  )
}
