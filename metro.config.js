const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { default: exclusionList } = require('metro-config/private/defaults/exclusionList');

const config = getDefaultConfig(__dirname);
const distDirPattern = new RegExp(`^${path.resolve(__dirname, 'dist').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:\\/.*)?$`);

config.resolver.blockList = exclusionList([
  /.*\.zip$/,
  distDirPattern,
]);

module.exports = config;
