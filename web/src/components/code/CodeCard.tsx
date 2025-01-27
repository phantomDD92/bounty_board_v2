'use client'

// React Imports
import { useState } from 'react'

import type { SyntheticEvent } from 'react'

import { CopyBlock, railscast } from 'react-code-blocks';

import {
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material'

import type { CodeCardProps } from '@/types/widgetTypes'
import type { CodeSnippetType } from '@/types/valueTypes'

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
          label={snippet.language}
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
              <CopyBlock
                language={snippets[selected].language}
                text={snippets[selected].code}
                showLineNumbers={true}
                wrapLongLines={true}
                theme={railscast}
              />
            }
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CodeCard
