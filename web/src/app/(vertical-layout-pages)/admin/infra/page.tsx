import InfraListTable from '@/views/admin/infra/InfraListTable'
import { Grid } from '@mui/material'


export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <InfraListTable />
      </Grid>
    </Grid>
  )
}
