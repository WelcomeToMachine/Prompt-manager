<script setup lang="ts">

  import { ref, onMounted } from 'vue'
  import { changeToDarkTheme } from '../scripts/utils.ts'
  import { changeToLightTheme } from '../scripts/utils.ts'
  import { formatDate } from '../scripts/utils.ts'
  import { useI18n } from "vue-i18n";
  import { prompts } from '../scripts/prompts.ts'
  import { categories } from '../scripts/categories.ts'
  import { config } from '../scripts/config.ts'
  import { DARK_THEME } from '../scripts/config.ts'
  import { LIGHT_THEME } from '../scripts/config.ts'

  const i18n = useI18n();

  // ******************* ERASE MODAL *******************
  const isEraseWrngModalVisible = ref(false);
  const eraseWrngModalTitleTxt = ref(i18n.t('settings_page.erase_modal_title_t'));
  const eraseWrngModalDescTxt = ref(i18n.t('settings_page.erase_modal_text_t'));

  const showEraseWrngModal = () => {
    isEraseWrngModalVisible.value = true;
  };

  const hideEraseWrngModal = () => {
    isEraseWrngModalVisible.value = false;
  };

  const eraseWrngModalHandleOk = () => {
    hideEraseWrngModal();
    eraseAll();
  };
  
  const eraseWrngModalHandleCancel = () => {
    hideEraseWrngModal();
  };

  // ******************* IMPORT MODAL *******************
  const isImportWrngModalVisible = ref(false);
  const importWrngModalTitleTxt = ref(i18n.t('settings_page.import_modal_title_t'));
  const importWrngModalDescTxt = ref(i18n.t('settings_page.import_modal_text_t'));

  let importFile: any

  const showImportWrngModal = (event: any) => {
    isImportWrngModalVisible.value = true;
    importFile = event.target.files[0];
  };
  const hideImportWrngModal = () => {
    isImportWrngModalVisible.value = false;
  };
  const importWrngModalHandleOk = () => {
    hideImportWrngModal();
    importFunc();
  };
  const importWrngModalHandleCancel = () => {
    hideImportWrngModal();
  };

// ******************* IMPORT / EXPORT *******************
  const importExportStateLabelSuccessColor = 'my-text-sm-success';
  const importExportStateLabelErrorColor = 'my-text-sm-error';
  
  const importExportStateLabel = ref('');
  const importExportStateLabelColor = ref('');

  const importFunc = () => {
    importExportStateLabel.value = '';
    if (importFile) {
      const reader = new FileReader();
      reader.onload = (e : any) => {
        try {
          const parsedData = JSON.parse(e.target.result);

          if (typeof parsedData !== 'object' || parsedData === null || !parsedData.prompts || !parsedData.categories) {
            throw new Error(i18n.t('settings_page.import_error_format_global_t'));
          }

          if (!Array.isArray(parsedData.prompts) || !Array.isArray(parsedData.categories)) {
            throw new Error(i18n.t('settings_page.import_error_format_arrays_t'));
          }

          // Basic validation of prompt structure (can be improved)
          for (const item of parsedData.prompts) {
            if (
              typeof item.name !== 'string' ||
              typeof item.description !== 'string' ||
              typeof item.text !== 'string' ||
              typeof item.category !== 'string'
            ) {
              throw new Error(
                i18n.t('settings_page.import_error_format_prompts_t')
              );
            }
          }

          eraseAll();
          prompts.setPrompts(parsedData.prompts);
          categories.setCategories(parsedData.categories);
          importExportStateLabel.value = i18n.t('settings_page.import_success_t');
          importExportStateLabelColor.value = importExportStateLabelSuccessColor;
        } catch (error: any) {
          console.error('Error parsing JSON:', error);
          importExportStateLabel.value = i18n.t('settings_page.import_error_prefix') + " " + error.message;
          importExportStateLabelColor.value = importExportStateLabelErrorColor;
        }
      };
      reader.readAsText(importFile);
    }
  };

  const exporFunc = async () => {
    const promptsArray = prompts.getPrompts();
    const categoriesArray = categories.getCategories();
    const exportData = {
      prompts: promptsArray,
      categories: categoriesArray
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);
    const downloadAnchorNode = document.createElement('a');
    const exportFileName = "Prompt-Manager." + formatDate(new Date) + ".json";
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportFileName);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    importExportStateLabel.value = i18n.t('settings_page.export_success_t');
    importExportStateLabelColor.value = importExportStateLabelSuccessColor;
  };

  // ******************* THEME *******************
  const isDarkChecked = ref(false);

  const handleCheckboxThemeChange = () => {
    isDarkChecked.value = !isDarkChecked.value;
    if (isDarkChecked.value) {
      changeToDarkTheme();
      config.setTheme(DARK_THEME);
    } else {
      changeToLightTheme();
      config.setTheme(LIGHT_THEME);
    }
    config.saveToStorage();
  };

  function eraseAll() {
    // Erase all data
    prompts.erase(); // Erase all prompts
    categories.erase(); // Erase all categories
  }

  // ******************* INTERNATIONALIZATION *******************

  const languageChangeHandler = (event: any) => {
    config.setLanguage(event.target.value);
    i18n.locale.value = config.getLanguage();
    config.saveToStorage();
  }

  // ******************* ON MOUNTED *******************

  async function loadConfig() {
    switch (config.getTheme()) {
      case DARK_THEME:
        isDarkChecked.value = true;
        changeToDarkTheme();
        break;
      case LIGHT_THEME:
        isDarkChecked.value = false;
        changeToLightTheme();
        break;
      default:
    }
  }

  onMounted(() => {
    loadConfig();
  });

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
<div class="w-screen h-screen  p-4 my-bg-white">
    <div class="container mx-auto">
      <dl class=" divide-y divide-gray-400 dark:divide-gray-400 text-sm">

        <!-- THEME -->
        <div class="py-4">
          <label class="relative inline-flex cursor-pointer select-none items-center">
            <input type="checkbox" class="sr-only" @change="handleCheckboxThemeChange" />
            <span class="my-field-label pr-4">{{ $t('settings_page.theme_l') }}</span>
            <div class="flex h-[46px] w-[82px] items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
              <span class="bg-gray-700 dark:bg-gray-700 flex h-9 w-9 items-center justify-center rounded text-white">
                <DayIcon/>
              </span>
              <span class="bg-gray-200 dark:bg-gray-100 text-body-color flex h-9 w-9 items-center justify-center rounded">
                <NightIcon/>
              </span>
            </div>
          </label>
        </div>

        <!-- LANGUAGE -->
        <div class="py-4">
          <p class="my-field-label">
            {{ $t('settings_page.language_l') }}
          </p>
          <div class="relative">
            <select id="Language" class="block w-full border my-select appearance-none" v-model="$i18n.locale" @change="languageChangeHandler($event)">
              <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
                {{ locale }}
              </option>
            </select>
            <SelectorIcon class="w-3 h-3 fill-gray-800 dark:fill-gray-200 absolute top-2.5 right-4 pointer-events-none"/>
          </div>
        </div>

        <!-- IMPORT / EXPORT -->
        <div class="py-4">
          <p class="my-field-label">
            {{ $t('settings_page.import_l') }} / {{ $t('settings_page.export_l') }}
          </p>
          <div class="flex space-x-4">
            <label for="importFile" class="justify-center my-normal-buttonn">
              {{ $t('settings_page.import_b') }} 
            </label>
            <input type="file" id="importFile" accept=".json" @change="showImportWrngModal" style="display: none;">
            <button @click="exporFunc"
              class="justify-center my-normal-buttonn">
              {{ $t('settings_page.export_b') }} 
            </button>
          </div>
          <label :class="`block my-2 ${importExportStateLabelColor}`"> {{ importExportStateLabel }}</label>
        </div>

        <!-- ERASE -->
        <div class="py-4">
          <p class="my-field-label">
            {{ $t('settings_page.erase_l') }} 
          </p>
          <p class="text-red-500 py-2">
            {{ $t('settings_page.erase_warning_t') }}
          </p>
          <div class="flex py-2">
            <button @click="showEraseWrngModal"
              class="justify-center my-warning-button">
              {{ $t('settings_page.erase_b') }}
            </button>
          </div>
        </div>
        <!-- MODAL ERASE DIALOG -->
        <WarningModal v-if="isEraseWrngModalVisible" :title="eraseWrngModalTitleTxt" :description="eraseWrngModalDescTxt" @ok="eraseWrngModalHandleOk" @cancel="eraseWrngModalHandleCancel" />

        <!-- MODAL IMPORT DIALOG -->
        <WarningModal v-if="isImportWrngModalVisible" :title="importWrngModalTitleTxt" :description="importWrngModalDescTxt" @ok="importWrngModalHandleOk" @cancel="importWrngModalHandleCancel" />
      </dl>
    <!-- BUTTONS -->
    <div class="flex flex-row-reverse space-x-4 space-x-reverse">
      <router-link :to="{ path: '/' }">
        <button class="justify-center my-action-button">
          {{ $t('settings_page.close_b') }}
        </button>
      </router-link>
    </div>
  </div>
</div>

<!-- DEBUG    
  <div v-if="importPrompts.length > 0">
    <h2>Imported Prompts</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Text</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(prompt, index) in importPrompts" :key="index">
          <td>{{ prompt.name }}</td>
          <td>{{ prompt.description }}</td>
          <td>{{ prompt.text }}</td>
          <td>{{ prompt.category }}</td>
        </tr>
      </tbody>
    </table>
  </div>
-->
</template>
<style>
</style>
