'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import {
  Card,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { toast } from 'react-toastify'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Component Imports

// Style Imports
import tableStyles from '@core/styles/table.module.css'

import { deleteVideoForAdmin, getVideoListForAdmin, publishVideoForAdmin } from '@/lib/api'

import type { VideoType, PublishType } from '@/types/valueTypes'

import { PublishStatus } from '@/types/enumTypes'
import { getStatusName } from '@/utils/string'
import PublishDialog from '../common/PublishDialog'
import VideoPreviewDialog from './VideoPreviewDialog'
import ConfirmDialog from '@/components/dialogs/ConfirmDialog'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type VideoWithActionsType = VideoType & {
  actions?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper<VideoWithActionsType>()

const VideoAdminView = () => {
  // States
  const [selected, setSelected] = useState<any>(undefined)
  const [publishShow, setPublishShow] = useState(false)
  const [previewShow, setPreviewShow] = useState(false)
  const [confirmShow, setConfirmShow] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<VideoType[]>([])
  const [filteredData, setFilteredData] = useState<VideoType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('0');

  useEffect(() => {
    getVideoListForAdmin()
      .then(newData => {
        setData(newData)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (status != `${PublishStatus.ALL}`) {
      const fData = data?.filter(item => `${item.status}` == status)

      setFilteredData(fData)
    } else {
      setFilteredData(data)
    }
  }, [status, data])

  const handlePublish = async (params: PublishType) => {
    publishVideoForAdmin(selected._id, params)
      .then(() => {
        toast.success(`Video updated successfully`);
        getVideoListForAdmin().then(newData => {
          setData(newData)
        })
      })
      .catch((error: any) => {
        toast.error(error.message)
      })
  }

  const handleDelete = async () => {
    setConfirmShow(false);
    deleteVideoForAdmin(selected._id)
      .then(() => {
        toast.success(`Video deleted successfully`);
        getVideoListForAdmin().then(newData => {
          setData(newData)
        }).catch(() => { })
      }).catch((error: any) => {
        toast.error(error.message);
      })
  }

  const columns = useMemo<ColumnDef<VideoWithActionsType, any>[]>(
    () => [
      // {
      //   id: 'select',
      //   header: ({ table }) => (
      //     <Checkbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler()
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <Checkbox
      //       {...{
      //         checked: row.getIsSelected(),
      //         disabled: !row.getCanSelect(),
      //         indeterminate: row.getIsSomeSelected(),
      //         onChange: row.getToggleSelectedHandler()
      //       }}
      //     />
      //   )
      // },
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <Typography
            variant='h6'
            sx={{
              maxWidth: 300, // Set a fixed width
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {row.original.title}
          </Typography>
        )
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <Typography
            variant='body1'
            sx={{
              width: 250, // Set a fixed width
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {row.original.description}
          </Typography>
        )
      }),
      columnHelper.accessor('creator', {
        header: 'Creator',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.creator?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
          <Chip
            label={getStatusName(row.original.status)}
            color={row.original.status == PublishStatus.APPROVED ? 'primary' : row.original.status == PublishStatus.REJECTED ? "error" : "warning"} />
      }),
      columnHelper.accessor('actions', {
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <Tooltip title="Preview">
              <IconButton
                size='small'
                onClick={() => {
                  setSelected(row.original)
                  setPreviewShow(true)
                }}
              >
                <i className='ri-eye-line text-[22px] text-textSecondary' />
              </IconButton>
            </Tooltip>
            {row.original.status == PublishStatus.PENDING &&
              <Tooltip title="Approve/Reject">
                <IconButton
                  size='small'
                  onClick={() => {
                    setSelected(row.original)
                    setPublishShow(true)
                  }}
                >
                  <i className='ri-presentation-line text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Delete">
              <IconButton
                size='small'
                color='error'
                onClick={() => {
                  setSelected(row.original)
                  setConfirmShow(true)
                }}
              >
                <i className='ri-delete-bin-line text-[22px] text-textError' />
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as VideoType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Video List' className='pbe-4' />
        <div className='flex items-start justify-start max-sm:flex-col sm:items-center gap-4 p-5'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search'
            className='max-sm:is-full'
          />
          <FormControl size='small' className='min-is-[175px]'>
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              id='select-status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              label='Status'
              labelId='status-select'
            >
              <MenuItem value={`${PublishStatus.ALL}`}>Any</MenuItem>
              <MenuItem value={`${PublishStatus.PENDING}`}>Pending</MenuItem>
              <MenuItem value={`${PublishStatus.APPROVED}`}>Approved</MenuItem>
              <MenuItem value={`${PublishStatus.REJECTED}`}>Rejected</MenuItem>
            </Select>
          </FormControl>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 15, 25]}
          component='div'
          className='border-bs'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
        <Divider className='mb-3' />
        <div className='overflow-x-auto mr-4 ml-4'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              'flex items-center': header.column.getIsSorted(),
                              'cursor-pointer select-none': header.column.getCanSort()
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: <i className='ri-arrow-up-s-line text-xl' />,
                              desc: <i className='ri-arrow-down-s-line text-xl' />
                            }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => {
                    return (
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                        ))}
                      </tr>
                    )
                  })}
              </tbody>
            )}
          </table>
        </div>
      </Card>
      {selected && (
        <PublishDialog
          open={publishShow}
          onCancel={() => setPublishShow(false)}
          onApprove={(feedback) => { setPublishShow(false); handlePublish({ feedback, approve: true }) }}
          onReject={(feedback) => { setPublishShow(false); handlePublish({ feedback, approve: false }) }}
        />
      )}
      {selected && (
        <VideoPreviewDialog
          open={previewShow}
          onClose={() => setPreviewShow(false)}
          data={selected}
        />
      )}
      {selected && (
        <ConfirmDialog
          question='Are you sure to delete the video?'
          data={selected}
          open={confirmShow}
          onCancel={() => setConfirmShow(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}

export default VideoAdminView
