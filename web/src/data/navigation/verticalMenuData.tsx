// Type Imports
import type { HorizontalMenuDataType, VerticalMenuDataType } from '@/types/menuTypes'

const verticalMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Bounties',
    href: '/admin/bounty',
    icon: 'ri-blogger-line'
  },
  {
    label: 'Infra',
    href: '/admin/infra',
    icon: 'ri-steering-line'
  },
  {
    label: 'Videos',
    href: '/admin/video',
    icon: 'ri-video-line'
  },
  {
    label: 'Codes',
    href: '/admin/code',
    icon: 'ri-codepen-line'
  }
]

export default verticalMenuData
