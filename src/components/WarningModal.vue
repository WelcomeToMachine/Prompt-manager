<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  
  defineProps<{
    title: string
    description?: string
  }>()
  
  defineEmits(['ok', 'cancel'])

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <teleport to="body">
    <div @click="$emit('cancel')" class="h-screen w-screen fixed top-0 left-0 flex items-center justify-center overflow-y-auto z-100 my-bg-modal-bg">
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div class="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div class="my-bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex size-14 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <CautionIcon class="w-8 h-8 stroke-red-500 stroke-2 mx-auto" />                    
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <p class="text-xl font-semibold my-text-gray">
                      {{ title }}
                    </p>
                  <div class="mt-2">
                    <p class="text-sm text-red-500" style="white-space: pre-line">
                      {{ description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row-reverse space-x-4 space-x-reverse p-2 my-bg-white">
              <button  @click="$emit('ok')" 
                type="button" class="justify-center my-warning-button">
                {{ $t('warning_modal.ok_b') }}
              </button>
              <button @click="$emit('cancel')"
                type="button" class="justify-center my-cancel-button">
                {{ $t('warning_modal.cancel_b') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>