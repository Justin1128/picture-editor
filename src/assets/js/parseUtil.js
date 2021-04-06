
import { computeFontSize,setFont,matchFont } from './psdUtil'

// 解析获取样式 text
export const parseTextStyle = function (val) {
    return {
        'top': val.top + 'px',
        'bottom': val.bottom + 'px',
        'left': val.left + 'px',
        'right': val.right + 'px',
        'font-size': computeFontSize(val) + 'px',
        'color': parseColor(val.font && val.font.colors[0]),
        'transform': `matrix(${val.transform.xx} ${val.transform.xy} ${val.transform.yx} ${val.transform.yy} ${val.transform.tx} ${val.transform.ty})`,
        'text-align': val.font.alignment && val.font.alignment[0],//*
        'line-height': computeFontSize(val) + 'px', //leading
        'font-weight': val.font.weights && val.font.weights[0],
        'text-decoration': val.font.textDecoration && val.font.textDecoration[0],
        'font-style': val.font.styles && val.font.styles[0],
        'font-family':val.font.names && val.font.names.join(',') 
    }
}

// 解析获取color
export const parseColor = function (val) {
    return val ? `rgba(${val.join(",")})` : "";
}