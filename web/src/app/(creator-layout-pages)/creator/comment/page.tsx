import { Grid } from '@mui/material'

import CommentCreatorView from '@/views/creator/comment/CommentCreatorView'

export default async function Page() {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <CommentCreatorView />
      </Grid>
    </Grid>
  )
}
