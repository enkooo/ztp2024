<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import BaseNav from '@/components/BaseNav.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template>
  <div class="flex min-h-screen w-full flex-col bg-muted/40">
    <Toaster />
    <BaseNav />
    <RouterView />
  </div>
</template>
