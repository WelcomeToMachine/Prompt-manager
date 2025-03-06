<script setup lang="ts">

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <div class="z-10 relative">
    <span class=" py-4 absolute left-1/2 transform -translate-x-1/2">
      <div class="grid grid-cols-1 content-center gap-2">
        <span class="group relative">
          <!-- TOOLTIP -->
          <div class="absolute bottom-0 left-full -translate-y-[.25rem] -translate-x-[.4rem] hidden group-hover:block w-auto">
            <div class="flex items-center">
              <TriangleIcon class="h-3 w-3 fill-gray-200 dark:fill-black" />
              <div class="bottom-full rounded bg-gray-200 dark:bg-black px-4 py-1 text-xs my-text-gray whitespace-nowrap">
                {{ $t('index_page.prompt_tooltip_t') }}
              </div>
            </div>
          </div>
          <!-- BUTTON -->
          <router-link :to="{name: 'prompt', params: { id: 'Add' }}">
            <PromptIcon class="h-9 w-9"/>
          </router-link>
        </span>
        <span class="group relative">
          <!-- TOOLTIP -->
          <div class="absolute bottom-0 left-full -translate-y-[.25rem] -translate-x-[.4rem] hidden group-hover:block w-auto">
            <div class="flex items-center">
              <TriangleIcon class="h-3 w-3 fill-gray-200 dark:fill-black" />
              <div class="bottom-full rounded bg-gray-200 dark:bg-black px-4 py-1 text-xs my-text-gray whitespace-nowrap">
                {{ $t('index_page.category_tooltip_t') }}
              </div>
            </div>
          </div>
          <!-- BUTTON -->
          <router-link :to="{name: 'category', params: { id: 'Add' }}">
            <CategoryIcon class="h-9 w-9" />
          </router-link>
        </span>
        <span class="group relative">
          <!-- TOOLTIP -->
          <div class="absolute bottom-0 left-full -translate-y-[.25rem] -translate-x-[.4rem] hidden group-hover:block w-auto">
            <div class="flex items-center">
              <TriangleIcon class="h-3 w-3 fill-gray-200 dark:fill-black" />
              <div class="bottom-full rounded bg-gray-200 dark:bg-black px-4 py-1 text-xs my-text-gray whitespace-nowrap">
                {{ $t('index_page.settings_tooltip_t') }}
              </div>
            </div>
          </div>
          <!-- BUTTON -->
          <router-link :to="{name: 'global-settings' }">
            <SettingsIcon class="h-9 w-9"/>
          </router-link>
        </span>
      </div>
    </span>
  </div>
    
  <div class="relative w-full h-full">
    <div class="absolute inset-x-0 bottom-0 content-center flex items-center justify-center">
      <PromptManagerIcon class="py-4 h-20 w-20" />
    </div>
  </div> 
</template>

