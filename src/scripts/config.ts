// 
import { reactive, ref } from 'vue'

import { copyByValue } from "./utils.ts";

export type Config = {
    theme: string;
    language: string;
};
export const DARK_THEME = 'Dark';
export const LIGHT_THEME = 'Light';

const defaultConfig: Config = { theme: LIGHT_THEME , language: 'en'};
const debugConfig: Config = { theme: DARK_THEME, language: 'fr' };

const configObj: any = ref({});

export const config = reactive({
    configObj,
    isInitialLoad: true,
    async loadFromStorage() {
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            this.configObj.value = await getConfigFromStorage();
        }
    },
    saveToStorage() {
        setConfigToStorage(this.configObj.value);
    },
    getLanguage() {
        return this.configObj.value.language
    },
    setLanguage(language: string) {
        this.configObj.value.language = language
    },
    getTheme() {
        return this.configObj.value.theme
    },
    setTheme(theme: string) {
        this.configObj.value.theme = theme
    }
})

async function getConfigFromStorage()  {
    let config = copyByValue(defaultConfig); // Default Config
    if (import.meta.env.DEV) {
        config = copyByValue(debugConfig);
    }else{
        let data = await chrome.storage.local.get('config');
        if (data.config == undefined) { // it's the first use of the extension
            setConfigToStorage(defaultConfig); // Save the default config
        }else{
            config = data.config;
        }
    }
    return config
}
function setConfigToStorage(config: Config) {
    if (import.meta.env.DEV) {
    }else{
        chrome.storage.local.set({ config: config });
    }
}