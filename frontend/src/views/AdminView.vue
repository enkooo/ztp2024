<script setup lang="ts">
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
} from '@tanstack/vue-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ArrowUpDown, Check } from 'lucide-vue-next'
import { h, ref, onMounted } from 'vue'
import RequestsTable from '@/components/RequestsTable.vue'
import type { Request } from '@/types/request'
import TablePagination from '@/components/TablePagination.vue'
import NoteModal from '@/components/NoteModal.vue'

const requests = ref<Request[]>([])
const isLoading = ref(false)
const rejectionNote = ref<string>('')
const total = ref(0)
const pagination = ref({ pageIndex: 0, pageSize: 10 })

async function fetchRequests() {
  isLoading.value = true
  try {
    const response = await fetch(
      `/api/requests?page=${pagination.value.pageIndex + 1}&limit=${pagination.value.pageSize}`
    )
    const data = await response.json()
    requests.value = data.data
    total.value = data.total
  } catch (error) {
    console.error('Error fetching requests:', error)
  } finally {
    isLoading.value = false
  }
}

async function updateRequestStatus(nip: string, status: number) {
  try {
    const body: any = { status }
    if (status === 1 && !rejectionNote.value.trim()) {
      alert('Please provide a rejection note.')
      return
    }
    if (status === 1) {
      body.notes = rejectionNote.value
    }

    const response = await fetch(`/api/requests/${nip}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (!response.ok) throw new Error('Failed to update status')
    rejectionNote.value = ''
    await fetchRequests()
  } catch (error) {
    console.error('Error updating request:', error)
  }
}

onMounted(async () => {
  await fetchRequests()
})

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => h('div', { class: 'capitalize' }, row.getValue('name')),
  },
  {
    accessorKey: 'nip',
    header: 'NIP',
    cell: ({ row }) => h('div', {}, row.getValue('nip')),
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return h(Button, {
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Email', h(ArrowUpDown, { class: 'ml-2 h-4 w-4' })])
    },
    cell: ({ row }) => h('div', { class: 'lowercase' }, row.getValue('email')),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => h('div', {}, row.getValue('phone')),
  },
  {
    accessorKey: 'address',
    header: 'Address',
    cell: ({ row }) => h('div', {}, row.getValue('address')),
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => h('div', {}, row.getValue('notes')),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as number
      let statusText = 'Pending'
      let statusClass = 'text-yellow-600'

      switch (status) {
        case 0:
          statusText = 'Pending'
          statusClass = 'text-yellow-600'
          break
        case 1:
          statusText = 'Rejected'
          statusClass = 'text-red-600'
          break
        case 2:
          statusText = 'Accepted'
          statusClass = 'text-green-600'
          break
      }

      return h('div', { class: `font-medium ${statusClass}` }, statusText)
    },
  },
  {
    accessorKey: 'createdate',
    header: 'Created At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdate'))
      return h('div', {}, date.toDateString())
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const request = row.original
      const isPending = request.status === 0

      return h('div', { class: 'flex gap-2' }, [
        isPending && h(Button, {
          variant: 'ghost',
          size: 'icon',
          class: 'h-8 w-8 text-green-600',
          onClick: () => updateRequestStatus(request.nip, 2),
        }, () => h(Check, { class: 'h-4 w-4' })),
        isPending && h(NoteModal, {
          onSaveNote: (value) => {
            rejectionNote.value = value
            updateRequestStatus(request.nip, 1)
          }
        }),
      ])
    },
  },
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  get data() { return requests.value },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  get rowCount() { return total.value },
  manualPagination: true,
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get pagination() {
      return pagination.value
    }
  },
  onColumnFiltersChange: (updater) => {
    columnFilters.value = typeof updater === 'function'
      ? updater(columnFilters.value)
      : updater
  },
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function'
      ? updater(sorting.value)
      : updater
  },
  onPaginationChange: (updater) => {
    pagination.value =
      updater instanceof Function
        ? updater(pagination.value)
        : updater
    fetchRequests()
  },
})
</script>

<template>
  <div class="w-full container mx-auto">
    <div class="flex items-center py-4">
      <Input class="max-w-sm" placeholder="Filter emails..."
        :model-value="table.getColumn('email')?.getFilterValue() as string"
        @update:model-value="table.getColumn('email')?.setFilterValue($event)" />
    </div>
    <RequestsTable :table="table" :columns="columns" :isLoading="isLoading" @update-status="updateRequestStatus" />
    <TablePagination :table="table" />
  </div>
</template>