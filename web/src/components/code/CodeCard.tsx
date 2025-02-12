'use client'

// React Imports
import { useState } from 'react'

import type { SyntheticEvent } from 'react'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'react-toastify';

import {
  Grid,
  IconButton,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

import type { CodeCardProps } from '@/types/widgetTypes'
import type { CodeSnippetType } from '@/types/valueTypes'

import { getLanguageLabel } from '@/utils/string';

type Props = {
  snippets: CodeSnippetType[]
  onChange?: (value: number) => void
}

const LanguageSelector = ({ snippets, onChange }: Props) => {
  // States
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  const handleTabChange = (event: SyntheticEvent, index: number) => {
    setSelectedIndex(index)
    onChange && onChange(index)
  }

  return (
    <Tabs
      value={selectedIndex}
      onChange={handleTabChange}
      textColor="primary"
      indicatorColor="secondary">
      {snippets.map((snippet, index) => (
        <Tab
          key={index}
          value={index}
          label={getLanguageLabel(snippet.language)}
        />
      ))}
    </Tabs>
  )
}

const CodeCard = (props: CodeCardProps) => {
  // Props
  const { title, description, snippets } = props.item
  const [selected, setSelected] = useState(0)

  const handleLanguageChange = (id: number) => {
    setSelected(id)
  }

  const handleCopyCode = async () => {
    if (snippets && snippets.length && navigator.clipboard) {
      await navigator.clipboard.writeText(snippets[selected].code);
      toast.success("Code copied");
    }
  }

  return (
    <div className='border rounded bs-full min-w-64'>
      <div className='flex flex-col gap-4 p-5'>
        <Grid container spacing={6}>
          {/* left code view */}
          <Grid item xs={12} md={6} lg={6}>
            <Typography variant='h5' className='hover:text-primary'>
              {title}
            </Typography>
            <Typography
              className='min-h-[250px] text-wrap break-words'
              component="pre" >
              {description}
            </Typography>
          </Grid>
          {/* right code view */}
          <Grid item xs={12} md={6} lg={6} className='flex flex-col gap-2'>
            {snippets && snippets.length > 0 && (
              <div className='flex gap-1 justify-between'>
                <LanguageSelector snippets={snippets} onChange={handleLanguageChange} />
              </div>
            )}
            {
              snippets && snippets.length > 0 &&
              <div className='overflow-x-auto relative'>
                <IconButton className='absolute right-5 top-5' onClick={handleCopyCode}>
                  <i className='ri-file-copy-line text-base' />
                </IconButton>
                <SyntaxHighlighter
                  language={snippets[selected].language}
                  style={materialDark}
                  >
                  {snippets[selected].code}
                </SyntaxHighlighter>
              </div>
            }
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CodeCard
