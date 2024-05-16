const { getDefaultConfig } = require('expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Add 'glb' to assetExts
defaultConfig.resolver.assetExts.push('glb');

module.exports = defaultConfig;
