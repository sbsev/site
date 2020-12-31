// https://github.com/GoogleChrome/lighthouse-ci
module.exports = {
  ci: {
    collect: {
      staticDistDir: `./__sapper__/export`,
    },
    // assert: {
    //   preset: `lighthouse:recommended`,
    // },
    upload: {
      target: `temporary-public-storage`,
    },
  },
}
