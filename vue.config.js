module.exports = {
    lintOnSave: false,
    devServer: {
        proxy: {
            '/innerApi': {
                target: 'xxx',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    'innerApi':''
                }
            }
        }
    }
}
