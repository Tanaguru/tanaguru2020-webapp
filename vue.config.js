module.exports = {
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
