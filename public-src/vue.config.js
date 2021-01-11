module.exports = {
  outputDir: '../public',
  publicPath: process.env.NODE_ENV === 'production' ? '/public/' : '/',
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8081
  }
}