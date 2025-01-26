export default {
	expo: {
		name: "Melios",
		slug: "melios",
		version: "1.1.22",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		platforms: ["ios", "android", "web"],
		scheme: "app",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},

		assetBundlePatterns: ["**/*"],
		ios: {
			buildNumber: "21",
			bundleIdentifier: "com.raphplt.melios",
			supportsTablet: true,
			googleServicesFile: process.env.GOOGLE_SERVICES_INFOPLIST,
		},
		android: {
			googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
			icon: "./assets/images/icon.png",
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			packageName: "com.raphplt.melios",
			package: "com.raphplt.melios",
			permissions: [
				"NOTIFICATIONS",
				"READ_EXTERNAL_STORAGE",
				"WRITE_EXTERNAL_STORAGE",
				"INTERNET",
			],
			minSdkVersion: 24,
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"@react-native-google-signin/google-signin",
			"expo-router",
			"expo-secure-store",
			[
				"@evennit/notifee-expo-plugin",
				{
					iosDeploymentTarget: "13.4",
					apsEnvMode: "development",
				},
			],
			[
				"expo-notifications",
				{
					icon: "./assets/images/icons/meliosIcon.png",
				},
			],
			[
				"expo-font",
				{
					fonts: ["assets/fonts/LibreBaskerville-Regular.ttf"],
				},
			],
		],
		experiments: {
			typedRoutes: true,
		},
		newArchEnabled: false,
		extra: {
			googleWebClientId:
				"709212823740-ugukkejdgg0c6fpip87ee675nurc8tg7.apps.googleusercontent.com",
			router: {
				origin: false,
			},
			eas: {
				projectId: "02832e16-a46a-43ec-8a0a-1b271300170e",
			},
		},
	},
};
