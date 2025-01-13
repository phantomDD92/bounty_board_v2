import Link from 'next/link'

import useLinkPreview from 'use-link-preview'

import Typography from '@mui/material/Typography'

type Props = {
  url: string
}

function LinkPreview(props: Props) {
  const { url } = props
  const { metadata } = useLinkPreview(url)

  // Usage example
  return (
    <Link href={url} >
      {metadata && (
        <div className='border rounded bs-full'>
          <div className='mli-2 mbs-2 overflow-hidden rounded'>
            <img src={metadata.img || ""} alt={metadata.title || "Image"} className='is-full bs-full object-cover' />
          </div>
          <div className='flex flex-col gap-2 p-5'>
            <Typography variant='h5'>{metadata.title}</Typography>
            <Typography>
              {metadata.description}
            </Typography>
          </div>
        </div>
      )}
    </Link>
  )
}

export default LinkPreview
