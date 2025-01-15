'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import { styled } from '@mui/material/styles'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { MenuItem } from '@mui/material'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import { checkAdmin } from '@/utils/session'
import { SessionType } from '@/types/valueTypes'
import Link from 'next/link'

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
})

type Props = {
  session?: SessionType
  dashboard?: boolean
  onLogout?: () => void
}

const UserDropdown = ({ onLogout, session, dashboard }: Props) => {
  // States
  const [open, setOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()

  const { settings } = useSettings()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(url)
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    setOpen(false)
    onLogout && onLogout()
  }

  const handleHomeClicked = (e: any) => {
    handleDropdownClose(e)
    if (checkAdmin(session))
      router.replace('/');
    else
      router.replace('/admin');
  }

  const getAddress = (session: SessionType | undefined) => {
    if (!session || !session?.iaddress)
      return ''
    const addressLen = session.iaddress.length;
    return session.iaddress.slice(0, 5) + '...' + session.iaddress.slice(addressLen - 5, addressLen)
  }

  return (
    <>
      <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
        <Badge
          ref={anchorRef}
          overlap='circular'
          badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          onClick={handleDropdownOpen}
          className='mis-2'
        >
          <Avatar
            ref={anchorRef}
            alt={session?.name}
            src='/images/avatars/1.png'
            className='cursor-pointer bs-[38px] is-[38px]'
          />
        </Badge>
      </div>
      <Popper
        open={open}
        transition
        disablePortal
        placement='auto'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center plb-2 pli-4 gap-2' tabIndex={-1}>
                    <Avatar alt={session?.name || ''} src='/images/avatars/1.png' />
                    <div className='flex items-start flex-col'>
                      <Typography className='font-medium' color='text.primary'>
                        {session?.name || ''}
                      </Typography>
                      <Typography variant='caption'>{getAddress(session)}</Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  {dashboard && <MenuItem className='gap-3' onClick={handleHomeClicked}>
                    <Link href="/">
                      <i className='ri-home-line' />
                      <Typography color='text.primary'>Home </Typography>
                    </Link>
                  </MenuItem>}
                  {checkAdmin(session) && !dashboard && <MenuItem className='gap-3'>
                    <Link className='flex' href="/admin">
                      <i className='ri-home-line' />
                      <Typography color='text.primary'>Admin Dashboard </Typography>
                    </Link>
                  </MenuItem>}
                  {!dashboard && <MenuItem className='gap-3' onClick={handleHomeClicked}>
                    <Link className='flex' href="/dashboard">
                      <i className='ri-home-line' />
                      <Typography color='text.primary'>Creator Dashboard </Typography>
                    </Link>
                  </MenuItem>}
                  <Divider className='mlb-1' />
                  {/* {!admin && */}
                  <div className='flex items-center plb-2 pli-4'>
                    <Button
                      fullWidth
                      variant='contained'
                      color='error'
                      size='small'
                      endIcon={<i className='ri-logout-box-r-line' />}
                      onClick={handleUserLogout}
                      sx={{ '& .MuiButton-endIcon': { marginInlineStart: 1.5 } }}
                    >
                      Logout
                    </Button>
                  </div>
                  {/* } */}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  )
}

export default UserDropdown
