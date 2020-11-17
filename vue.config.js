module.exports = {
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
        //proxy: 'http://178.33.132.243:9002',
        //proxy: 'http://localhost:9002'
    },
    css: {
      loaderOptions: {
        sass: {
          prependData: `@import "@/scss/style.scss";`
        }
      }
    }
  };
