import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import { createRouter, createMemoryHistory } from 'vue-router';
import IndexPage from './components/IndexPage.vue';
import CategoryPage from './components/CategoryPage.vue';
import PromptPage from './components/PromptPage.vue';
import GlobalSettingsPage from './components/GlobalSettingsPage.vue';
import WarningModal from './components/WarningModal.vue';
import PromptParamsPage from './components/PromptParamsPage.vue';

import CautionIcon from './components/Icons/CautionIcon.vue';
import EditIcon from './components/Icons/EditIcon.vue';
import DeleteIcon from './components/Icons/DeleteIcon.vue';
import CopyIcon from './components/Icons/CopyIcon.vue';
import PromptIcon from './components/Icons/PromptIcon.vue';
import CategoryIcon from './components/Icons/CategoryIcon.vue';
import SettingsIcon from './components/Icons/SettingsIcon.vue';
import PromptManagerIcon from './components/Icons/PromptManagerIcon.vue';
import FilterIcon from './components/Icons/FilterIcon.vue';
import SelectorIcon from './components/Icons/SelectorIcon.vue';
import NightIcon from './components/Icons/NightIcon.vue';
import DayIcon from './components/Icons/DayIcon.vue';
import TriangleIcon from './components/Icons/TriangleIcon.vue';

const router = createRouter({
    history: createMemoryHistory(),
    routes: [
    { path: '/', component: IndexPage },
    { path: '/category/:id', name: 'category', component: CategoryPage },
    { path: '/global-settings', name: 'global-settings', component: GlobalSettingsPage },
    { path: '/prompt/:id', name: 'prompt', component: PromptPage }
    ]
})

const app = createApp(App)
app.use(router)
app.component('WarningModal', WarningModal)
app.component('PromptParamsPage', PromptParamsPage)

// icons
app.component('CautionIcon', CautionIcon)
app.component('EditIcon', EditIcon)
app.component('DeleteIcon', DeleteIcon)
app.component('CopyIcon', CopyIcon)
app.component('PromptIcon', PromptIcon)
app.component('CategoryIcon', CategoryIcon)
app.component('SettingsIcon', SettingsIcon)
app.component('PromptManagerIcon', PromptManagerIcon)
app.component('FilterIcon', FilterIcon)
app.component('SelectorIcon', SelectorIcon)
app.component('NightIcon', NightIcon)
app.component('DayIcon', DayIcon)
app.component('TriangleIcon', TriangleIcon)

// I18n 
import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import fr from './locales/fr.json'

export const defaultLocale = 'en'

export const languages = {
    en: en,
    fr: fr,
}

const messages = Object.assign(languages)
const i18n = createI18n({
    locale: defaultLocale,
    fallbackLocale: defaultLocale,
    legacy: false,
    messages: messages,
})
app.use(i18n)


app.mount('#app')
