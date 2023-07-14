/* eslint-disable @typescript-eslint/no-var-requires */
const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    blockList: [config.resolver.blockList, /(\/server\/.*)$/],
  },
}
