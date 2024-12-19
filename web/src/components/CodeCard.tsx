'use client'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Grid from '@mui/material/Grid'
import { CodeCardProps } from '@/types/widgetTypes'
// React Imports
import { useRef, useState } from 'react'
import type { SyntheticEvent } from 'react'

import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'
import ButtonGroup from '@mui/material/ButtonGroup'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { CodeSnippetType } from '@/types/valueTypes'

type Props = {
  snippets: CodeSnippetType[]
  onChange?: Function
}

const LanguageSelector = ({ snippets, onChange }: Props) => {
  // States
  const [open, setOpen] = useState<boolean>(false)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  // Refs
  const anchorRef = useRef<HTMLDivElement | null>(null)

  const handleMenuItemClick = (event: SyntheticEvent, index: number) => {
    setSelectedIndex(index)
    setOpen(false)
    onChange && onChange(index)
  }

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <ButtonGroup variant='outlined' ref={anchorRef} aria-label='split button' size='small'>
        <Button>{snippets[selectedIndex].language}</Button>
        <Button
          className='pli-0'
          aria-haspopup='menu'
          onClick={handleToggle}
          aria-label='select merge strategy'
          aria-expanded={open ? 'true' : undefined}
          aria-controls={open ? 'split-button-menu' : undefined}
        >
          <i className='ri-arrow-down-s-line text-lg' />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition placement='bottom-end'>
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps} style={{ transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top' }}>
            <Paper className='shadow-lg'>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id='split-button-menu'>
                  {snippets.map((snippet, index) => (
                    <MenuItem
                      key={index}
                      selected={index === selectedIndex}
                      onClick={event => handleMenuItemClick(event, index)}
                    >
                      {snippet.language}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

const CodeCard = (props: CodeCardProps) => {
  // Props
  const { title, description, snippets } = props.item
  const [selected, setSelected] = useState(0)

  const handleLanguageChange = (id: number) => {
    setSelected(id)
  }

  return (
    <div className='border rounded bs-full min-w-64'>
      <div className='flex flex-col gap-4 p-5'>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6} lg={6}>
            <Typography variant='h5' className='hover:text-primary'>
              {title}
            </Typography>
            <Typography component='pre' className='text-wrap'>
              {description}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} lg={6} className='flex flex-col'>
            <div className='flex gap-1 justify-end'>
              {snippets && snippets.length > 0 && (
                <LanguageSelector snippets={snippets} onChange={handleLanguageChange} />
              )}
            </div>
            <SyntaxHighlighter
              className=''
              language={snippets && snippets.length > 0 ? snippets[selected].language : ''}
              style={materialDark}
              showLineNumbers={true}
              wrapLongLines={true}
            >
              {snippets && snippets.length > 0 && snippets[selected].snippet}
            </SyntaxHighlighter>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CodeCard
