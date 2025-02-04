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
import moment from 'moment'
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

import { getBountyListForUser, deleteBountyForUser, completeBountyForUser } from '@/lib/api'

import type { BountyType } from '@/types/valueTypes'
import { Status } from '@/types/enumTypes'

import { getStatusName } from '@/utils/string'

import ConfirmDialog from '@/components/dialogs/ConfirmDialog'

import BountyPreviewDialog from './BountyPreviewDialog'
import BountyEditDrawer from './BountyEditDrawer'
import BountyAssignDrawer from './BountyAssignDrawer'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type BountyWithActionsType = BountyType & {
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
const columnHelper = createColumnHelper<BountyWithActionsType>()

const BountyCreatorView = () => {
  // States
  const [selected, setSelected] = useState<any>(undefined)
  const [confirmShow, setConfirmShow] = useState(false)
  const [previewShow, setPreviewShow] = useState(false)
  const [editShow, setEditShow] = useState(false)
  const [assignShow, setAssignShow] = useState(false)
  const [completeShow, setCompleteShow] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<BountyType[]>([])
  const [filteredData, setFilteredData] = useState<BountyType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [status, setStatus] = useState('0');

  useEffect(() => {
    getBountyListForUser()
      .then(newData => {
        setData(newData)
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (status != `${Status.ALL}`) {
      const fData = data?.filter(item => `${item.status}` == status)

      setFilteredData(fData)
    } else {
      setFilteredData(data)
    }
  }, [status, data])

  const handleDelete = () => {
    setConfirmShow(false);
    deleteBountyForUser(selected._id)
      .then(() => {
        toast.success(`Bounty deleted successfully`);
        getBountyListForUser().then(newData => {
          setData(newData);
        })
      })
      .catch((error: any) => {
        toast.error(error.message)
      })
  }

  const handleComplete = () => {
    setCompleteShow(false);
    completeBountyForUser(selected._id)
      .then(() => {
        toast.success(`Bounty completed successfully`);
        getBountyListForUser().then(newData => {
          setData(newData);
        })
      })
      .catch((error: any) => {
        toast.error(error.message)
      })
  }


  const handleUpdateData = () => {
    setEditShow(false)
    setAssignShow(false);
    getBountyListForUser().then(newData => {
      setData(newData)
    }).catch(() => { })
  }


  const columns = useMemo<ColumnDef<BountyWithActionsType, any>[]>(
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
      columnHelper.accessor('creator', {
        header: 'Creator',
        cell: ({ row }) => (
          <Typography className='font-medium' color='text.primary'>
            {row.original.creator?.name}
          </Typography>
        )
      }),
      columnHelper.accessor('reward', {
        header: 'Reward',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.reward}
          </Typography>
        )
      }),
      columnHelper.accessor('deadline', {
        header: 'Deadline',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {moment(row.original.deadline).format('YYYY-MM-DD')}
          </Typography>
        )
      }),
      columnHelper.accessor('assignee', {
        header: 'Assignee',
        cell: ({ row }) => (
          <Typography color='text.primary'>
            {row.original.assignee?.name || "-"}
          </Typography>
        )
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) =>
          <Chip
            label={getStatusName(row.original.status)}
            color={row.original.status == Status.PENDING ? 'warning'
              : row.original.status == Status.OPEN ? "primary"
                : row.original.status == Status.ASSIGNED ? "success"
                  : row.original.status == Status.COMPLETED ? "secondary"
                    : row.original.status == Status.DELETED ? "default"
                      : "error"} />
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
            {row.original.status != Status.COMPLETED &&
              <Tooltip title="Edit">
                <IconButton
                  size='small'
                  onClick={() => {
                    setSelected(row.original)
                    setEditShow(true)
                  }}
                >
                  <i className='ri-edit-line text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            }
            {(row.original.status == Status.OPEN || row.original.status == Status.ASSIGNED) &&
              <Tooltip title="Assign">
                <IconButton
                  size='small'
                  onClick={() => {
                    setSelected(row.original)
                    setAssignShow(true)
                  }}
                >
                  <i className='ri-user-shared-line text-[22px] text-textSecondary' />
                </IconButton>
              </Tooltip>
            }
            {row.original.status == Status.ASSIGNED &&
              <Tooltip title="Complete">
                <IconButton
                  size='small'
                  onClick={() => {
                    setSelected(row.original)
                    setCompleteShow(true)
                  }}
                >
                  <i className='ri-door-closed-line text-[22px] text-textSecondary' />
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
                <i className='ri-delete-bin-line text-[22px] text-textSecondary' />
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
    data: filteredData as BountyType[],
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
        <CardHeader title='Bounty Submissions' className='pbe-4' />
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
              labelId='status-select'>
              <MenuItem value={`${Status.ALL}`}>Any</MenuItem>
              <MenuItem value={`${Status.PENDING}`}>Pending</MenuItem>
              <MenuItem value={`${Status.OPEN}`}>Open</MenuItem>
              <MenuItem value={`${Status.ASSIGNED}`}>Assigned</MenuItem>
              <MenuItem value={`${Status.COMPLETED}`}>Completed</MenuItem>
              <MenuItem value={`${Status.REJECTED}`}>Rejected</MenuItem>
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
        <div className='overflow-x-auto'>
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
      {selected &&
        <>
          <BountyPreviewDialog
            open={previewShow}
            onClose={() => setPreviewShow(false)}
            data={selected}
          />
          <ConfirmDialog
            question='Are you sure to delete the bounty?'
            data={selected}
            open={confirmShow}
            onCancel={() => setConfirmShow(false)}
            onConfirm={handleDelete}
          />
          <ConfirmDialog
            question='Are you sure to complete the bounty?'
            data={selected}
            open={completeShow}
            onCancel={() => setCompleteShow(false)}
            onConfirm={handleComplete}
          />
          <BountyEditDrawer
            open={editShow}
            data={selected}
            onClose={() => setEditShow(false)}
            onUpdate={handleUpdateData}
          />
          <BountyAssignDrawer
            open={assignShow}
            data={selected}
            onClose={() => setAssignShow(false)}
            onUpdate={handleUpdateData}
          />
        </>
      }
    </>
  )
}

export default BountyCreatorView
