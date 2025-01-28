// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const horizontalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Bounty',
    href: '/bounty',
    icon: 'ri-blogger-line'
  },
  {
    label: 'Infra',
    href: '/infra',
    icon: 'ri-steering-line'
  },
  {
    label: 'Video',
    href: '/video',
    icon: 'ri-video-line'
  },
  {
    label: 'Social',
    href: '/social',
    icon: 'ri-community-line'
  },
  {
    label: 'Code',
    href: '/code',
    icon: 'ri-codepen-line'
  }
]

export default horizontalMenuData
