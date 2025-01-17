import { Grid } from '@mui/material'

import UserListTable from '@/views/admin/user/UserListTable'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserListTable />
      </Grid>
    </Grid>
  )
}
