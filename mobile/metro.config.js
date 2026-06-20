const { getDefaultConfig } = require("expo/metro-config")
const path = require("path")

const config = getDefaultConfig(__dirname)

config.resolver.extraNodeModules = {
  "@casaemordem/shared": path.resolve(__dirname, "../shared"),
}

config.watchFolders = [path.resolve(__dirname, "../shared")]

module.exports = config
