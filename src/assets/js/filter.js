// 定义一个图片过滤器
export function DFSImg(path, w, h) {
    if (path == null || path === '') {
        // return require('@/assets/images/default.gif')
        return
    }
    if (path.indexOf('http') === 0) {
        return path
    }

    const baseImg = process.env.IMG_DOMAIN
    //   let num = Math.floor(Math.random()*baseImg.length)
    //   var uri = baseImg[num]
    if (path.indexOf('/') !== 0) {
        path = '/' + path
    }
    if (!Array.isArray(baseImg) && (baseImg.indexOf('aliyun') >= 0 || baseImg.indexOf('cdn') >= 0)) {
        var style = ''
        if (w) style += ',w_' + w
        if (h) style += ',h_' + h
        if (style.length > 0) {
            path += '?x-oss-process=image/resize,m_pad,limit_0' + style
        }
        return baseImg + path
    } else {
        if (w && h) {
            path += '.' + w + 'x' + h + '.jpg'
        }
        return baseImg[Math.floor(Math.random() * 100) % baseImg.length] + path
    }
}