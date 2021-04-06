import { fontList } from "../font-o"

// 已安装字体
let fontInstalledList = []

/* 计算字号 */
export const computeFontSize = function (node, defValue = 12) {

    const { transform, font } = node;
    let transY = transform.yy; // 2.000077137715913
    let fontSize = font.sizes && font.sizes[0]; // 15.99938 ✘
    let lineHeight = font.leadings && font.leadings[0];  // 60 ✘

    fontSize = Math.round((fontSize * transY) * 100) * 0.01; // 32 ✔
    lineHeight = Math.round((fontSize * transY) * 100) * 0.01; // 64 ✔
    return fontSize - 4
}

/* 动态添加字体 */
export function setFont(name, url) {
    for (const iterator of fontInstalledList) {
        if (name == iterator) return
    }
    // 字体库地址
    url = `https://xxx/static/fonts/${url}`
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = `@font-face {font-family:${name};src:url(${url})};font-display: swap`;
    document.getElementsByTagName('head')[0].appendChild(style);
    fontInstalledList.push(name);
}

/* 匹配字体名称和url */
export function matchFont(n) {
    console.log(fontList, n, '--------------');
    for (const key in fontList) {
        if (fontList[key] == n[0]) {

        }

    }
}