<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from "vue-i18n";
  import type { Category }  from '../scripts/categories.ts'
  import { categories } from '../scripts/categories.ts'
  import { prompts } from '../scripts/prompts.ts'

  const i18n = useI18n();

  const route = useRoute();
  const router = useRouter();
  
  const ROUTE_ID_ADD = 'Add';

  const MODE_VIEW_ADD = i18n.t('global.add_b');
  const MODE_VIEW_MODIFY = i18n.t('global.modify_b');
  
  const categoryName = ref('');
  const modeView = ref('');
  
  const inputCategoryNameStateLabel = ref('');


  const categoryNameExists = (name: string) => {
    return categories.getCategories().some((Category: Category) => Category.name.toLowerCase() === name.toLowerCase());
  };

  const addModifyCategoryButton = () => {
    const id = route.params.id;
    if (!categoryName.value) {
      inputCategoryNameStateLabel.value = i18n.t('category_page.check_error_name_t');
      return;
    }

    if (categoryNameExists(categoryName.value)) {
      if(modeView.value === MODE_VIEW_ADD) {
        inputCategoryNameStateLabel.value = i18n.t('category_page.check_error_exist_t');
        return;
      }
      else { // the category name already exists, but there's nothing to modify
        router.push({ path: '/' });
        return;
      }
    }
    switch (modeView.value) {
      case MODE_VIEW_ADD:
          categories.addCategory({ name: categoryName.value });
          router.push({ path: '/' });
        break;
      case MODE_VIEW_MODIFY:
          let previousCategoryName = categories.getCategories()[Number(id)].name;
          categories.modifyCategory(Number(id), categoryName.value);
          // rename categories in prompts
          prompts.renameCategoryInPrompts(previousCategoryName, categoryName.value);
          router.push({ path: '/' });
        break;
      default:
    }
  };

  function loadData() {
    const id = route.params.id;
    if(id === ROUTE_ID_ADD ) {
      modeView.value = MODE_VIEW_ADD;
    }else {
      modeView.value = MODE_VIEW_MODIFY;
    }
    if (modeView.value !== MODE_VIEW_ADD && categories.getCategories()[Number(id)]) {
      categoryName.value = categories.getCategories()[Number(id)].name;
    }
  }


// ******************* ON MOUNTED *******************
  onMounted(() => {
    loadData();
  });

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <div class="w-screen h-screen  p-4 my-bg-white">
    <div class="container mx-auto">
      <!-- NAME -->
      <p class="my-field-label after:ml-0.5 after:text-red-500 after:content-['*']">{{ $t('category_page.name_l') }}</p>    
      <input type="text" id="categoryName" :placeholder="$t('category_page.name_p')" v-model="categoryName" class="block w-full my-input" />
      <label for="categoryName" class="block mb-2 my-text-sm-error"> {{ inputCategoryNameStateLabel }}</label>
      <br />
      <!-- BUTTONS -->
      <div class="flex flex-row-reverse space-x-4 space-x-reverse p-2">
            <button @click="addModifyCategoryButton"
              class="justify-center rounded-lg my-action-button">
                {{ modeView }}
            </button>
            <router-link :to="{ path: '/' }">
              <button class="justify-center my-cancel-button">
                {{ $t('global.cancel_b') }}
              </button>
            </router-link>
          </div>
  <!--
  -->
    </div>
  </div>
</template>
