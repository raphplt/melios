const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs, ts, tsx, js, jsx, json, mjs");

module.exports = defaultConfig;
