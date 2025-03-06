export function copyByValue<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}


export const changeToDarkTheme = () => {
    const html = document.documentElement;
    if (!html.classList.contains('dark')) {
        html.classList.add('dark');
    }
}

export const changeToLightTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
    }
}

export const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        // console.log('Text copied to clipboard');
    }, () => {
        // console.error('Error while copying text to clipboard');
    });
}

export const formatDate = (date: Date) => {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('.');
}

export const replaceAll = (str: string, find: string, replace: string) => {
    return str.replace(new RegExp(find, 'g'), replace);
}

export const getPromptTextParams = (regexp: string, promptText: string, retrieveGroup: boolean) => {
    let i: number = retrieveGroup ? 1 : 0;
    const re = new RegExp(regexp,"g");
    const arrayResult: string[] = [];
    let match;
    while ((match = re.exec(promptText)) !== null) {
        arrayResult.push(match[i]);
    }
    const uniqueArrayResult = [...new Set(arrayResult)];
    return uniqueArrayResult.length > 0 ? uniqueArrayResult : null;
}

export const replacePromptTextParams = (promptText: string, paramsKeys: string[], paramsValues: string[]) => {
    let newText: string = promptText;
    if (paramsKeys && paramsValues && paramsKeys.length === paramsValues.length) {
        for (let i = 0; i < paramsKeys.length; i++) {
            newText = replaceAll(newText, paramsKeys[i], paramsValues[i]);
        }
    }
    return newText;
};