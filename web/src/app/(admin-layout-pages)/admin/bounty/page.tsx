import { Grid } from '@mui/material'

import BountyListTable from '@/views/admin/bounty/BountyListTable'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BountyListTable />
      </Grid>
    </Grid>
  )
}
