<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/toast'
import { X } from 'lucide-vue-next'

const emit = defineEmits(['update:modelValue', 'saveNote'])

const note = ref('')

function saveNote() {
  if (!note.value?.trim()) {
    toast({
      title: 'Error',
      description: 'Please provide a note.',
      variant: 'destructive',
    });
    return
  }

  emit('saveNote', note.value)
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="ghost" size="icon" class="h-8 w-8 text-red-600" @click="() => { }">
        <X class="h-4 w-4"></X>
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add a note</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="note" class="text-right">
            Note
          </Label>
          <Input id="note" v-model="note" placeholder="Enter your note here" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" @click="saveNote">
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
