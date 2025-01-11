<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  table: any
}>()

const currentPage = computed(() => props.table.getState().pagination.pageIndex + 1)
const totalPages = computed(() => Math.ceil(props.table.getPageCount()))
</script>

<template>
  <div class="flex items-center justify-between space-x-2 py-4">
    <div class="text-sm">
      Page
      <strong>{{ currentPage }}</strong> of
      <strong>{{ totalPages }}</strong>
    </div>

    <div class="space-x-2 flex items-center">
      <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
        Previous
      </Button>
      <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
        Next
      </Button>
    </div>
  </div>
</template>
