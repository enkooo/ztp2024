<script setup lang="ts">
import { ref } from 'vue'
import SendRequestForm from '@/components/SendRequestForm.vue'
import CheckRequestStatus from '@/components/CheckRequestStatus.vue'

const activeView = ref('send')

const setActiveView = (view: string) => {
  activeView.value = view
}
</script>

<template>
  <main class="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
    <div class="mx-auto grid w-full max-w-6xl gap-2">
      <h1 class="text-3xl font-semibold">
        Request
      </h1>
    </div>
    <div class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
      <nav class="grid gap-4 text-sm text-muted-foreground">
        <a href="#" @click.prevent="setActiveView('send')"
          :class="{ 'font-semibold text-primary': activeView === 'send' }">
          Send request
        </a>
        <a href="#" @click.prevent="setActiveView('status')"
          :class="{ 'font-semibold text-primary': activeView === 'status' }">
          Check request status
        </a>
      </nav>
      <div class="grid gap-6">
        <SendRequestForm v-if="activeView === 'send'" />
        <CheckRequestStatus v-if="activeView === 'status'" />
      </div>
    </div>
  </main>
</template>
