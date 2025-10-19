// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "expo-router/babel",
      // keep this last line for Reanimated
      "react-native-reanimated/plugin",
    ],
  };
};
