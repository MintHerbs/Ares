// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);

  // 1. Tell Metro to use the SVG transformer
  config.transformer.babelTransformerPath = require.resolve(
    "react-native-svg-transformer"
  );

  // 2. Remove svg from assetExts, add svg to sourceExts
  config.resolver.assetExts = config.resolver.assetExts.filter(
    ext => ext !== "svg"
  );
  config.resolver.sourceExts = [
    ...config.resolver.sourceExts,
    "svg"
  ];

  // 3. Point Metro at the real AssetRegistry so it can load PNGs, etc.
  config.resolver.assetRegistryPath = require.resolve(
    "react-native/Libraries/Image/AssetRegistry"
  );

  return config;
})();
