import { Grid } from '@mui/material'

import CodeListTable from '@/views/admin/code/CodeListTable'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CodeListTable />
      </Grid>
    </Grid>
  )
}
