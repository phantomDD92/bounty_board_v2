import { Grid } from '@mui/material'

import CommentAdminView from '@/views/admin/comment/CommentAdminView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CommentAdminView />
      </Grid>
    </Grid>
  )
}
