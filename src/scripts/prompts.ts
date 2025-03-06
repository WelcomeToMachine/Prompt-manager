// 
import { reactive, ref } from 'vue'

import { copyByValue } from "./utils.ts";

export type Prompt = {
    name: string;
    description: string;
    text: string;
    category: string;
};

const debugPrompts: Prompt[] = [{ name: 'Prompt 1', description: 'Prompt 1 description is very long to make a test', text: 'Prompt 1 - {{A}} {{B}}', category: 'Category 1' }, { name: 'Prompt 2', description: '', text: 'Prompt 2 - {{OK}} ahah {{}}', category: '' }];
const promptsArray: any = ref([]);

export const prompts = reactive({
    promptsArray,
    isInitialLoad: true,
    async loadFromStorage() {
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            this.promptsArray.value = await getPromptsFromStorage();
        }
    },
    saveToStorage() {
        setPromptsToStorage(this.promptsArray.value);
    },
    getPrompts() {
        return this.promptsArray.value
    },
    setPrompts(promptsArray: Prompt[]) {
        this.promptsArray.value = promptsArray;
        prompts.saveToStorage();
    },
    modifyPrompt(index: number, promptName: string, promptDescription: string, promptText: string, promptCategory: string) {
        this.promptsArray.value[index].name = promptName;
        this.promptsArray.value[index].description = promptDescription;
        this.promptsArray.value[index].text = promptText;
        this.promptsArray.value[index].category = promptCategory;
        prompts.saveToStorage();
    },
    removePrompt( index: number) {
        let deletedPrompt = this.promptsArray.value.splice(index, 1);
        prompts.saveToStorage();
        return deletedPrompt
    },
    addPrompt( prompt: Prompt) {
        this.promptsArray.value.push(prompt);
        prompts.saveToStorage();
    },
    promptNameExists(name: string) {
        return this.promptsArray.value.some((Prompt: Prompt) => Prompt.name.toLowerCase() === name.toLowerCase());
    },
    removeCategoryInPrompts(categoryName: string) {
        let isChanged: boolean = false;
        this.promptsArray.value.forEach(function(element: Prompt) {
            if (element.category === categoryName) {
                element.category = "";
                isChanged = true;
            }
        });
        if (isChanged) {
            prompts.saveToStorage();
        }
    },
    renameCategoryInPrompts(previousCategoryName: string, newCategoryName: string) {
        let isChanged: boolean = false;
        this.promptsArray.value.forEach(function(element: Prompt) {
            if (element.category === previousCategoryName) {
                element.category = newCategoryName;
                isChanged = true;
            }
        });
        if (isChanged) {
            prompts.saveToStorage();
        }
    },
    erase() {
        this.promptsArray.value.splice(0, this.promptsArray.value.length);
        prompts.saveToStorage();
    }
})

async function getPromptsFromStorage()  {
    let prompts: Prompt[] = []; // Default
    if (import.meta.env.DEV) {
        prompts = copyByValue(debugPrompts);
    }else{
        let data = await chrome.storage.local.get('prompts');
        if (data.prompts == undefined) { // there is no categories
        }else{
            prompts = data.prompts; // Set the data
        }
    }
    return prompts
}

function setPromptsToStorage(prompts: Prompt[]) {
    if (import.meta.env.DEV) {
    }else{
        // if copyByValue isn't used when a Prompt[] corresponding to a prompts.value, the type is automaticaly changed by a {} type instead of an Array type.
        chrome.storage.local.set({ prompts: copyByValue(prompts) });
    }
}