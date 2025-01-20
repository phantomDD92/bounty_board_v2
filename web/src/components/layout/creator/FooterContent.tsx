'use client'

// Next Imports
import Link from 'next/link'

// Third-party Imports
import classnames from 'classnames'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const FooterContent = () => {

  return (
    <div
      className={classnames(verticalLayoutClasses.footerContent, 'flex items-center justify-between flex-wrap gap-4')}
    >
      <span>{`© ${new Date().getFullYear()}, Made by `}</span>
        <Link href='#' target='_blank' className='text-primary'>
          XXX
        </Link>
    </div>
  )
}

export default FooterContent
