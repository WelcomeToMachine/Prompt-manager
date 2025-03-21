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