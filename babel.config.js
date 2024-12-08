module.exports = function (api) {
  api.cache(true);
  return {
			presets: [
				["babel-preset-expo", { jsxImportSource: "nativewind" }],
				"nativewind/babel",
				// "react-native-reanimated/plugin",
				// "react-native-iconify/plugin",
			],
			plugins: ["react-native-reanimated/plugin", "react-native-iconify/plugin"],
		};
};
