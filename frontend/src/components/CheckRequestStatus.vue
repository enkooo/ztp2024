<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/toast'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as z from 'zod'

const formSchema = toTypedSchema(z.object({
  nip: z.string().regex(/^\d{12}$/, 'NIP must be exactly 12 digits'),
}))

const { handleSubmit } = useForm({
  validationSchema: formSchema,
})

interface RequestResponse {
  status: number
  createdate: string
  nip: string
  name: string
  id: string
  notes?: string
}

const responseData = ref<RequestResponse | null>(null)

const onSubmit = handleSubmit(async (values) => {
  try {
    const response = await fetch(`/api/requests/${values.nip}`)
    const data = await response.json()

    if (response.ok) {
      responseData.value = data
    } else {
      throw new Error(data.error)
    }
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message,
      variant: 'destructive',
    })
  }
})

const getStatusText = (status: number) => {
  const statuses: { [key: number]: string } = {
    0: 'Pending',
    1: 'Rejected',
    2: 'Accepted',
  }
  return statuses[status] || 'Unknown'
}
</script>

<template>
  <form class="w-2/3 space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="nip">
      <FormItem>
        <FormLabel>NIP</FormLabel>
        <FormControl>
          <Input type="text" placeholder="123456789012" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">
      Check status
    </Button>

    <div v-if="responseData" class="mt-6 p-6 bg-white rounded-lg shadow-sm">
      <div class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-600">Status:</span>
          <span class="px-3 py-1 rounded-full text-sm" :class="{
            'bg-yellow-100 text-yellow-700': responseData.status === 0,
            'bg-red-100 text-red-700': responseData.status === 1,
            'bg-green-100 text-green-700': responseData.status === 2,
          }">{{ getStatusText(responseData.status) }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-600">Created:</span>
          <span class="text-gray-700">{{ new Date(responseData.createdate).toDateString() }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-600">NIP:</span>
          <span class="text-gray-700">{{ responseData.nip }}</span>
        </div>

        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-600">Name:</span>
          <span class="text-gray-700">{{ responseData.name }}</span>
        </div>

        <div v-if="responseData.notes" class="flex items-center gap-2">
          <span class="font-semibold text-gray-600">Notes:</span>
          <span class="text-gray-700">{{ responseData.notes }}</span>
        </div>
      </div>

      <div v-if="responseData.status === 2" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="flex items-center gap-2 text-green-700">
          <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd" />
          </svg>
          <span class="font-medium">Your request has been accepted!</span>
        </div>
        <div class="mt-2 flex gap-2">
          <span class="font-semibold text-gray-600">API Key:</span>
          <code class="px-2 py-1 bg-green-100 rounded text-green-700 font-mono">{{ responseData.id }}</code>
        </div>
      </div>
    </div>
  </form>
</template>