'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {

  return (
    <div
      className={classnames(horizontalLayoutClasses.footerContent, 'flex items-center justify-center flex-wrap gap-4')}
    >
      <span>
        <span>{`© ${new Date().getFullYear()}, Made by `}</span>
        <Link href='#' target='_blank' className='text-primary'>
          XXX
        </Link>
      </span>
    </div>
  )
}

export default FooterContent
