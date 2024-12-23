import BountyListTable from '@/views/admin/bounty/BountyListTable'
import { Grid } from '@mui/material'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <BountyListTable />
      </Grid>
    </Grid>
  )
}
