module.exports = {
    publicPath: '.',
    chainWebpack: config => {
        config
            .plugin('define')
            .tap(args => {
                let v = JSON.stringify(require('./package.json').version)
                args[0]['process.env']['VERSION'] = v
                return args
            })
    },
    devServer: {
        proxy: 'http://localhost:9002',
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: true,
        hotOnly: false,
    },
    css: {
      loaderOptions: {
        sass: {
          prependData: `@import "@/scss/style.scss";`
        }
      }
    }
  };