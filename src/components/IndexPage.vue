<script setup lang="ts">
  import IndexPageMenu from './IndexPageMenu.vue'
  import IndexPageCategories from './IndexPageCategories.vue'
  import IndexPagePrompts from './IndexPagePrompts.vue'
  import { changeToDarkTheme } from '../scripts/utils.ts'
  import { changeToLightTheme } from '../scripts/utils.ts'
  import { ref, onMounted } from 'vue';
  import { config } from '../scripts/config.ts'
  import { DARK_THEME } from '../scripts/config.ts'
  import { LIGHT_THEME } from '../scripts/config.ts'

const selectedCategory = ref(-1); // root category

import { useI18n } from "vue-i18n";
const i18n = useI18n();

async function loadConfig() {
  await config.loadFromStorage();
  switch (config.getTheme()) {
    case DARK_THEME:
      changeToDarkTheme();
      break;
    case LIGHT_THEME:
      changeToLightTheme();
      break;
    default:
  }
  i18n.locale.value = config.getLanguage();
}

const selectedCategoryHandle = (categoryIndex: number) => {
  selectedCategory.value = categoryIndex;
};

// ******************* ON MOUNTED *******************
onMounted(() => {
  loadConfig();
});

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <div class="h-screen flex">
    <div class="w-1/9 bg-sky-600 dark:bg-gray-900">
      <IndexPageMenu />
    </div>
    <div class="w-3/9 bg-gray-100 dark:bg-gray-800">      
      <IndexPageCategories @category-selected="selectedCategoryHandle"/>
    </div>
    <div class="w-5/9 bg-white dark:bg-gray-700">
      <IndexPagePrompts :categorySelected="selectedCategory" />
    </div>
  </div>
</template>
