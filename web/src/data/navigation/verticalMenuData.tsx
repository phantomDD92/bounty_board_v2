// Type Imports
import type { HorizontalMenuDataType } from '@/types/menuTypes'

const adminMenuData = (): HorizontalMenuDataType[] => [
  {
    label: 'Users',
    href: '/admin/user',
    icon: 'ri-group-line'
  },
  {
    label: 'Tags',
    href: '/admin/tag',
    icon: 'ri-price-tag-line'
  },
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
    label: 'Socials',
    href: '/admin/social',
    icon: 'ri-community-line'
  },
  {
    label: 'Codes',
    href: '/admin/code',
    icon: 'ri-codepen-line'
  }
]

export default adminMenuData
