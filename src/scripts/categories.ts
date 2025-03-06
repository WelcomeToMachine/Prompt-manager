// 
import { reactive, ref } from 'vue'

import { copyByValue } from "./utils.ts";

export const ROOT_CATEGORY_INDEX: number = -1;

export type Category = {
    name: string;
};

const debugCategories: Category[] = [{ name: 'Category 1' }, { name: 'Category 2 is long' }];
const categoriesArray: any = ref([]);

export const categories = reactive({
    categoriesArray,
    isInitialLoad: true,
    async loadFromStorage() {
        if (this.isInitialLoad) {
            this.isInitialLoad = false;
            this.categoriesArray.value = await getCategoriesFromStorage();
        }
    },
    saveToStorage() {
        setCategoriesToStorage(this.categoriesArray.value);
    },
    getCategories() {
        return this.categoriesArray.value
    },
    setCategories(categoriesArray: Category[]) {
        this.categoriesArray.value = categoriesArray;
        categories.saveToStorage();
    },
    modifyCategory(index: number, categoryName: string) {
        this.categoriesArray.value[index].name = categoryName;
        categories.saveToStorage();
    },
    removeCategory( index: number) {
        let deletedCategory = this.categoriesArray.value.splice(index, 1);
        categories.saveToStorage();
        return deletedCategory;
    },
    addCategory( category: Category) {
        this.categoriesArray.value.push(category);
        categories.saveToStorage();
    },
    getCategoryName(index: number) {
        let name: string = '';
        if (index < this.categoriesArray.value.length) {
            name = this.categoriesArray.value[index].name;
        }
        return name;
    },
    erase() {
        this.categoriesArray.value.splice(0, this.categoriesArray.value.length);
        categories.saveToStorage();
    }
})

async function getCategoriesFromStorage()  {
    let categories: Category[] = []; // Default
    if (import.meta.env.DEV) {
        categories = copyByValue(debugCategories);
    }else{
        let data = await chrome.storage.local.get('categories');
        if (data.categories == undefined) { // there is no categories
        }else{
            let sortedCategories: Category[] = data.categories;
            sortedCategories.sort(sortByName);
            categories = sortedCategories; // Set the data
        }
    }
    return categories
}
function setCategoriesToStorage(categories: Category[]) {
    if (import.meta.env.DEV) {
        let sortedCategories: Category[] = categories;
        sortedCategories.sort(sortByName);
    }else{
        let sortedCategories: Category[] = categories;
        sortedCategories.sort(sortByName);
        chrome.storage.local.set({ categories: copyByValue(sortedCategories) });
    }
}

const sortByName = (a: Category, b: Category) => {
    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
};