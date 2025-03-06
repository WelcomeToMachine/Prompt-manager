<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from "vue-i18n";
  import { prompts } from '../scripts/prompts.ts'
  import { categories } from '../scripts/categories.ts'
  
  const i18n = useI18n();

  const promptCategories: any = ref([]);

  const route = useRoute();
  const router = useRouter();

  const promptName = ref('');
  const promptDescription = ref('');
  const promptText = ref('');
  const promptCategory = ref('');

  const ROUTE_ID_ADD = 'Add';

  const MODE_VIEW_ADD = i18n.t('global.add_b');
  const MODE_VIEW_MODIFY = i18n.t('global.modify_b');
  const modeView = ref('');

  const inputPromptNameStateLabel = ref('');
  const inputPromptTextStateLabel = ref('');


  const addModifyPromptButton = () => {
    const id = route.params.id;
    if ((promptName.value) && (!promptText.value)) {
      inputPromptNameStateLabel.value = '';
      inputPromptTextStateLabel.value = i18n.t('prompt_page.check_error_text_t');
      return;
    }
    if ((!promptName.value) && (promptText.value)) {
      inputPromptNameStateLabel.value = i18n.t('prompt_page.check_error_name_t');
      inputPromptTextStateLabel.value = '';
      return;
    }
    if ((!promptName.value) && (!promptText.value)) {
      inputPromptNameStateLabel.value = i18n.t('prompt_page.check_error_name_t');
      inputPromptTextStateLabel.value = i18n.t('prompt_page.check_error_text_t');
      return;
    }

    if (prompts.promptNameExists(promptName.value)) {
      if(modeView.value === MODE_VIEW_ADD) {
        inputPromptNameStateLabel.value = i18n.t('prompt_page.check_error_exist_t');
        return;
      }
      else { // the category name already exists, but there's nothing to modify
      }
    }

    switch (modeView.value) {
      case MODE_VIEW_ADD:
          prompts.addPrompt({ name: promptName.value, description: promptDescription.value, text: promptText.value, category: promptCategory.value });
          router.push({ path: '/' });
        break;
      case MODE_VIEW_MODIFY:
          prompts.modifyPrompt(Number(id), promptName.value, promptDescription.value, promptText.value, promptCategory.value);
          router.push({ path: '/' });
        break;
      default:
    }
  };

  function loadData() {
    const id = route.params.id;
    promptCategories.value = categories.getCategories();
    if(id === ROUTE_ID_ADD ) {
      modeView.value = MODE_VIEW_ADD;
    }else {
      modeView.value = MODE_VIEW_MODIFY;
    } 
    if (modeView.value === MODE_VIEW_MODIFY){
    
      if (prompts.getPrompts()[Number(id)]) {
        promptName.value = prompts.getPrompts()[Number(id)].name;
        promptDescription.value = prompts.getPrompts()[Number(id)].description;
        promptText.value = prompts.getPrompts()[Number(id)].text;
        promptCategory.value = prompts.getPrompts()[Number(id)].category;
      }
    }
  }

  // ******************* ON MOUNTED *******************  
  onMounted(async() => {
    loadData();
  });

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <div class="w-screen h-screen  p-4 my-bg-white">
    <div class="container mx-auto">
      <!-- NAME -->
      <p class="my-field-label after:ml-0.5 after:text-red-500 after:content-['*']">{{ $t('prompt_page.name_l') }}</p>
      <input type="text" id="promptName" v-model="promptName" class="block w-full my-input" :placeholder="$t('prompt_page.name_p')">
      <label for="promptName" class="block mb-2 my-text-sm-error">
        {{ inputPromptNameStateLabel }}
      </label>
    
      <!-- DESCRIPTION -->
      <p class="my-field-label">{{ $t('prompt_page.description_l') }}</p>
      <input type="text" id="promptDescription" v-model="promptDescription" class="block w-full my-input" :placeholder="$t('prompt_page.description_p')">
      <!-- TEXT -->
      <p class="my-field-label after:ml-0.5 after:text-red-500 after:content-['*']">{{ $t('prompt_page.text_l') }}</p>
      <textarea id="promptText" v-model="promptText" rows="4" class="block w-full border my-text-area" :placeholder="$t('prompt_page.text_p')"></textarea>
      <label for="promptText" class="block mb-2 my-text-sm-error"> {{ inputPromptTextStateLabel }}</label>
    
      <!-- CATEGORY -->
      <p class="my-field-label">{{ $t('prompt_page.category_l') }}</p>
      <div class="relative">
      
        <select id="promptCategory" v-model="promptCategory" class="block w-full border my-select appearance-none">
          <option></option>
          <option v-for="category in promptCategories"> {{ category.name }} </option>
        </select>
        <SelectorIcon class="w-3 h-3 fill-gray-800 dark:fill-gray-200 absolute top-2.5 right-4 pointer-events-none"/>
      </div>
      <!-- BUTTONS -->
      <div class="flex flex-row-reverse space-x-4 space-x-reverse p-2">
          <button @click="addModifyPromptButton"
            class="justify-center rounded-lg my-action-button">
            {{ modeView }}
          </button>
          <router-link :to="{ path: '/' }">
            <button class="justify-center my-cancel-button">
              {{ $t('global.cancel_b') }}
            </button>
          </router-link>
      </div>
    </div>
  </div>
</template>
