<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { defineProps,defineEmits } from 'vue';
  import { prompts } from '../scripts/prompts.ts'

  export type PromptParamsPageResponse = {
    promptIndex : number;
    paramsValues: string[];
  }

  const props = defineProps({
    promptIndex: Number,
    params: Array,
  })

  const emit = defineEmits<{
    (e: 'ok', value: PromptParamsPageResponse): void,
    (e: 'cancel'): void
  }>();

  const parameters: any = ref([]);
  const promptText: any = ref('');
  const promptIndex: any = ref(-1);

  const isPromptVisible: any = ref(false);

  const toggleShowPrompt = () => {
    isPromptVisible.value = !isPromptVisible.value;
  }

  const validerParamsButton = () => {
    const inputValues = parameters.value.map((_parameter: string, index: number) => {
      const inputElement = document.getElementById("param-" + String(index)) as HTMLInputElement;
      return inputElement ? inputElement.value : '';
    });
    const response: PromptParamsPageResponse = { promptIndex: promptIndex.value, paramsValues: inputValues};
    emit('ok', response);
  }


  // ******************* ON MOUNTED *******************
  onMounted(() => {
    parameters.value = props.params;
    promptText.value = prompts.getPrompts()[Number(props.promptIndex)].text;
    promptIndex.value = props.promptIndex;
  });

</script>

<template>
<!-- To debug the style, add this : style="border:1px solid black;" -->
  <teleport to="body">
    <div class="w-screen h-screen p-4 fixed top-0 left-0 flex my-bg-white overflow-y-auto z-100">
      <div class="container mx-auto overflow-y-auto">
        <dl class="divide-y divide-gray-400 dark:divide-gray-400 text-sm">
          <div class="container">
            <div class="flex items-center space-x-2 my-field-label">
              <p> {{ $t('prompt_params_page.parameters_l') }}</p>
              <CircleIcon class="h-2 w-2 fill-gray-900 dark:fill-gray-200" />              
            </div>
            <div class="flex mb-2 items-center cursor-pointer" @click="toggleShowPrompt">
              <p class="px-2 text-left text-sm my-text-gray">{{ $t('prompt_params_page.show_prompt_t') }}</p>
              <div>
                <TriangleIcon v-if="!isPromptVisible" class="h-3 w-3 fill-gray-800 dark:fill-gray-200 rotate-180" />
                <TriangleIcon v-else class="h-3 w-3 fill-gray-800 dark:fill-gray-200 -rotate-90 translate-y-1" />
              </div>
            </div>
            <p v-if="isPromptVisible" class="p-2 m-2 text-left text-sm my-text-gray italic bg-gray-100 dark:bg-gray-800 max-h-30 overflow-y-auto" style="white-space: pre-line">
                {{ promptText }}
            </p>
          </div>
          <!-- PARAMS -->
          <div>
            <div v-for="(parameter, index) in parameters">
              <p class="my-field-label after:ml-0.5">{{ parameter }}</p>    
              <textarea :id="`param-${index}`" rows="2" class="block w-full border my-text-area"></textarea>
            </div>
          </div>
        </dl>
        <br />
        <!-- BUTTONS -->
        <div class="flex flex-row-reverse space-x-4 space-x-reverse p-2">
          <button @click="validerParamsButton"
            class="justify-center rounded-lg my-action-button">
            {{ $t('prompt_params_page.done_params_b') }}
          </button>
          <router-link :to="{ path: '/' }">
            <button @click="$emit('cancel')"
              class="justify-center my-cancel-button">
              {{ $t('global.cancel_b') }}
            </button>
          </router-link>
        </div>
      </div>
    </div>
  </teleport>
</template>
