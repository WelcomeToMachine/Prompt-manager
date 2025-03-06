<script setup lang="ts">
  import { ref, defineEmits, onMounted } from 'vue';
  import { useI18n } from "vue-i18n";
  import { categories } from '../scripts/categories.ts'
  import { ROOT_CATEGORY_INDEX } from '../scripts/categories.ts'
  import { prompts } from '../scripts/prompts.ts'


  const i18n = useI18n();
  
  const emit = defineEmits(['category-selected']);

  const isRootCategorySelected = ref(true);

  const clickItem = (index: number) => {
    emit('category-selected', index);
    if (index !== ROOT_CATEGORY_INDEX) {
      isRootCategorySelected.value = false;
    }
  }


  // ******************* DELETE MODAL *******************
  const isDeleteWrngModalVisible = ref(false);
  const deleteWrngModalTitleTxt = ref(i18n.t('index_page.delete_category_modal_title_t'));
  const deleteWrngModalDescTxt = ref(i18n.t('index_page.delete_category_modal_text_t'));

  let deleteCategoryIndex: number;

  const showDeleteWrngModal = (index: number) => {
    deleteCategoryIndex = index;
    isDeleteWrngModalVisible.value = true;
  };

  const hideDeleteWrngModal = () => {
    isDeleteWrngModalVisible.value = false;
  };

  const deleteWrngModalHandleOk = () => {
    hideDeleteWrngModal();
    // delete the category
    const removedCategory = categories.removeCategory(deleteCategoryIndex); // remove the category
    // delete the category in prompts
    prompts.removeCategoryInPrompts(removedCategory[0].name);
    isRootCategorySelected.value = true;
    emit('category-selected', ROOT_CATEGORY_INDEX);
  };

  const deleteWrngModalHandleCancel = () => {
    hideDeleteWrngModal();
  };

// ******************* ON MOUNTED *******************
  const categoryArray: any = ref('');
  onMounted(async() => {
    await categories.loadFromStorage();
    categoryArray.value = categories.getCategories();
  });

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <div class="flex h-screen w-full overflow-y-auto overflow-x-hidden p-2">
    <div class="flex-col flex-grow">
          <!-- the root category -->
          <div class="py-1">
            <input type="radio" name="option" id="-1" class="peer hidden" @click="clickItem(-1)" :checked="isRootCategorySelected === true"/> 
            <label for="-1" class="group/item relative cursor-pointer flex items-center select-none bg-gray-400 justify-between rounded-lg py-3 p-1 peer-checked:bg-sky-500 peer-checked:font-bold peer-checked:text-white">
              <div class="flex overflow-hidden gap-2 px-2">
                <div class="w-full text-sm font-bold truncate">
                  {{ $t('index_page.root_category_name_l') }}
                </div>
              </div>
            </label>
          </div>
        
          <!-- USER CATEGORIES -->
          <div v-for="(category, index) in categoryArray" class="ml-4 py-1">
          
            <input @click="clickItem(index)"
              type="radio" name="option" :id="String(index)" class="peer hidden"  />
            <label :for="String(index)" class="group/item relative flex items-center select-none justify-between my-category-elem peer-checked:bg-sky-500 peer-checked:font-bold peer-checked:text-white">
              <div class="flex overflow-hidden gap-2 px-2">
                <div class="w-full my-text-gray text-sm truncate">
                    {{ category.name }}
                </div>
              </div>
            
            <!-- CONTEXT BUTTONS -->
              <span class="group/edit invisible relative flex">
                <router-link :to="{name: 'category', params: { id: index }}">
                  <div class="items-center group-hover/item:visible my-category-elem-icon-bg">
                    <EditIcon class="my-elem-icon"/>
                  </div>
                </router-link>
              <span @click="showDeleteWrngModal(index)"
                  class="items-center group-hover/item:visible my-category-elem-icon-bg">
                  <DeleteIcon class="my-elem-icon"/>
                </span>
              </span>
            </label>
          </div>
        </div>
      
      <!-- DELETE MODAL DIALOG -->
      <WarningModal v-if="isDeleteWrngModalVisible" :title="deleteWrngModalTitleTxt" :description="deleteWrngModalDescTxt" @ok="deleteWrngModalHandleOk" @cancel="deleteWrngModalHandleCancel" />
    </div>
</template>
