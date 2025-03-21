<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { defineProps } from 'vue';
  import FilterIcon from './Icons/FilterIcon.vue';
  import { copyToClipboard } from '../scripts/utils.ts'
  import { getPromptTextParams } from '../scripts/prompts.ts'
  import { replacePromptTextParams } from '../scripts/prompts.ts'
  import { promptContainsParams } from '../scripts/prompts.ts'
  import { prompts } from '../scripts/prompts.ts'
  import type { Prompt } from '../scripts/prompts.ts'
  import { useI18n } from "vue-i18n";
  import type { PromptParamsPageResponse } from './PromptParamsPage.vue'
  import { categories } from '../scripts/categories.ts'
  import { ROOT_CATEGORY_INDEX } from '../scripts/categories.ts'
  
  const i18n = useI18n();

  const props = defineProps({
    categorySelected: Number,
  })

  const clickItem = (index: number, event: any) => {
    if (event) {
      // to copy to clipboard only if the click is not on icons (edits or delete)
      if ((event.target.tagName !== 'svg') && (event.target.tagName !== 'SPAN') && (event.target.tagName !== 'path') ) {
        if(promptContainsParams(prompts.getPrompts()[index].text)) {
          const params = getPromptTextParams(prompts.getPrompts()[index].text, true);
          showParamsPage(index, params);
        }else{
          showClipboardIcon(index);
          copyToClipboard(prompts.getPrompts()[index].text);
        }
      }
    }
  }

  const showClipboardIcon = (index: number) => {
    const container = document.getElementById('clipboard-container-' + index);
    if (container !== null) {
      setTimeout(() => {
        container.classList.remove('hidden');
        setTimeout(() => container.classList.add('hidden'), 
        1000);
      }, 0);
    }
  }

  const searchTerm = ref('');

  const filteredPrompts = computed(() => {
    const promptsArray = prompts.getPrompts();
    if (!promptsArray) {
      return [];
    }
    return promptsArray.filter((prompt: Prompt) =>
      prompt.name.toLowerCase().includes(searchTerm.value.toLowerCase()) &&
      (props.categorySelected === ROOT_CATEGORY_INDEX || prompt.category === categories.getCategoryName(Number(props.categorySelected)))  
    );
  });

// ******************* DELETE MODAL *******************
  const isDeleteWrngModalVisible = ref(false);
  const deleteWrngModalTitleTxt = ref(i18n.t('index_page.delete_prompt_modal_title_t'));
  const deleteWrngModalDescTxt = ref(i18n.t('index_page.delete_prompt_modal_text_t'));

  let deletePromptIndex: number;

  const showDeleteWrngModal = (index: number) => {
    deletePromptIndex = index;
    isDeleteWrngModalVisible.value = true;
  };
  const hideDeleteWrngModal = () => {
    isDeleteWrngModalVisible.value = false;
  };
  const deleteWrngModalHandleOk = () => {
    hideDeleteWrngModal();
    prompts.removePrompt(deletePromptIndex); // remove the prompt
  };
  const deleteWrngModalHandleCancel = () => {
    hideDeleteWrngModal();
  };

// ******************* PARAMS *******************
  const isParamsPageVisible = ref(false);
  const paramsPagePromptIndex : any = ref(0);
  const paramsPageParams: any = ref([]);

  const showParamsPage = (promptIndex: number, params: string[]) => {
    paramsPagePromptIndex.value = promptIndex;
    paramsPageParams.value = params;
    isParamsPageVisible.value = true;
  };
  const hideParamsPage = () => {
    isParamsPageVisible.value = false;
  };

  const paramsPageHandleOk = (response: PromptParamsPageResponse) => {
    hideParamsPage();
    const paramsKeys = getPromptTextParams(prompts.getPrompts()[response.promptIndex].text, false);
    if (paramsKeys) {
      copyToClipboard(replacePromptTextParams(prompts.getPrompts()[response.promptIndex].text, paramsKeys, response.paramsValues ));
    } else {
      copyToClipboard(prompts.getPrompts()[response.promptIndex].text);
    }
    showClipboardIcon(response.promptIndex);
  };

  const paramsPageHandleCancel = () => {
    hideParamsPage();
  };

  const showParamIcon = (promptText: string): Boolean => {
    return promptContainsParams(promptText);
  };

// ******************* ON MOUNTED *******************

  onMounted(async() => {
    await categories.loadFromStorage();
    await prompts.loadFromStorage();
  });
</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->

  <div class="flex flex-col h-screen w-full p-2 space-y-3">
    <!-- SEARCH INPUT -->
    <div class="flex">
        <input
        type="search"
        class="relative m-0 block flex-auto my-input"
        :placeholder="$t('index_page.filter_p')"
        id="Filter"
        v-model="searchTerm" />
      <span
        class="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-surface dark:border-neutral-400 dark:text-white [&>svg]:h-5 [&>svg]:w-5"
        id="button-addon2">
          <FilterIcon class="h-5 w-5 fill-gray-800 dark:fill-white"/>
      </span>
    </div>

    <!-- PROMPTS -->
    <div class="justify-center flex-grow overflow-y-auto">
      <ul role="list" class="">
        <li @click="clickItem(index, $event)"
          v-for="(prompt, index) in filteredPrompts" class="group/item relative flex items-center justify-between my-prompt-elem" >

          <!-- COPY INCON -->
          <div v-bind:id="`clipboard-container-${index}`" class="hidden">            
            <CopyIcon class="h-8 w-8 stroke-green-600 dark:stroke-green-400 stroke-1.5"/>
          </div>

          <!-- PROMPT INFOS -->
          <div class="flex-auto overflow-hidden gap-2 px-2" >
            <div class="w-full text-sm">
              <div class="my-text-gray font-bold select-none truncate">
                <div class="flex items-center space-x-1">
                  <p>
                    {{ prompt.name }}
                  </p>
                  <CircleIcon v-if="showParamIcon(prompt.text)" class="h-2 w-2 fill-gray-900 dark:fill-gray-200" />
                </div>
              </div>
              <div class="my-text-gray text-sm px-2 select-none">
                <p v-if="prompt.description === ''" class="truncate"><br /></p>
                <p v-else class="truncate">{{ prompt.description }}</p>
              </div>
            </div>
          </div>

          <!-- CONTEXT BUTTONS -->
          <span id="context-buttons" class="group/edit invisible relative flex">
            <router-link :to="{name: 'prompt', params: { id: index }}">
              <div class="group/edit invisible items-center group-hover/item:visible my-prompt-elem-icon-bg">
                <EditIcon class="my-elem-icon"/>
              </div>
            </router-link>
            <span  @click="showDeleteWrngModal(index)"
              class="group/edit invisible items-center group-hover/item:visible my-prompt-elem-icon-bg">
              <DeleteIcon class="my-elem-icon"/>
            </span>
          </span>
        </li>
      </ul>
    </div>
  </div>
    <!-- DELETE MODAL DIALOG -->
    <WarningModal v-if="isDeleteWrngModalVisible" :title="deleteWrngModalTitleTxt" :description="deleteWrngModalDescTxt" @ok="deleteWrngModalHandleOk" @cancel="deleteWrngModalHandleCancel" />

    <!-- PARAMS PAGE -->
    <PromptParamsPage v-if="isParamsPageVisible" :promptIndex="paramsPagePromptIndex" :params="paramsPageParams" @ok="paramsPageHandleOk" @cancel="paramsPageHandleCancel" />

</template>
