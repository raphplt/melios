module.exports = function (api) {
	api.cache(true);
	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
		plugins: [
			[
				"module-resolver",
				{
					alias: {
						"@firebase/auth": "./node_modules/@firebase/auth/dist/index.rn.d.ts",
						"@db": "./db",
						"@hooks": "./hooks",
						"@utils": "./utils",
						"@components": "./components",
						"@context": "./context",
						"@assets": "./assets",
						"@type": "./type",
						"@constants": "./constants",
						"@locales": "./locales",
					},
				},
			],
			"react-native-reanimated/plugin",
			"react-native-iconify/plugin",
		],
	};
};
