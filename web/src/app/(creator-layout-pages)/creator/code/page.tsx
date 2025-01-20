import { Grid } from '@mui/material'

import CodeCreatorView from '@/views/creator/code/CodeCreatorView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CodeCreatorView />
      </Grid>
    </Grid>
  )
}
