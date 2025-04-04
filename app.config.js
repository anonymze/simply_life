export default {
	expo: {
		name: "Simply Life",
		slug: "simply-life",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		// simply-life://some_path
		scheme: "simply-life",
		// theme
		userInterfaceStyle: "light",
		newArchEnabled: true,
		locales: {
			en: "./i18n/metadata/ios/en.json",
			fr: "./i18n/metadata/ios/fr.json",
			es: "./i18n/metadata/ios/es.json",
		},
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.anonymze.simplylife",
			associatedDomains: ["applinks:simply-life.expo.app"],
			infoPlist: {
			},
			CFBundleAllowMixedLocalizations: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			googleServicesFile: "./resources/google-services.json",
			package: "com.anonymze.simplylife",
			config: {
				googleMaps: {
					// can be public restricted to the app
					apiKey: "AIzaSyDS8h4LEfphnaXei8dCRdFfoYQDNPDZ1wo",
				},
			},
			// softwareKeyboardLayoutMode: "pan",
			intentFilters: [
				{
					action: "VIEW",
					autoVerify: true,
					data: {
						host: "simply-life.expo.app",
						scheme: "https",
						pathPrefix: "/login",
					},
					category: ["DEFAULT", "BROWSABLE"],
				},
				{
					action: "VIEW",
					autoVerify: true,
					data: {
						host: "simply-life.expo.app",
						scheme: "https",
						pathPrefix: "/sponsors",
					},
					category: ["DEFAULT", "BROWSABLE"],
				},
			],
		},
		web: {
			bundler: "metro",
			output: "server",
			favicon: "./assets/images/favicon.png",
		},
		plugins: [
			"expo-router",
			[
				"expo-splash-screen",
				{
					backgroundColor: "#ffffff",
					image: "./assets/images/splash-icon.png",
					// dark: {
					// 	image: "./assets/images/splash-icon-dark.png",
					// 	backgroundColor: "#ffffff",
					// },
					imageWidth: 220,
				},
			],
			[
				"expo-image-picker",
				{
					photosPermission: "Allow $(PRODUCT_NAME) to access your photos",
					cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
					microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
				},
			],
			[
				"expo-speech-recognition",
				{
					microphonePermission: "Allow $(PRODUCT_NAME) to use the microphone.",
					speechRecognitionPermission: "Allow $(PRODUCT_NAME) to use speech recognition.",
					androidSpeechServicePackages: ["com.google.android.googlequicksearchbox"],
				},
			],
			"expo-font",
			"expo-localization",
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			router: {
				origin: false,
			},
			eas: {
				projectId: "71cf24a7-3efc-4fe5-9b69-f37c315aebbc",
			},
		},
		updates: {
			url: "https://u.expo.dev/71cf24a7-3efc-4fe5-9b69-f37c315aebbc",
		},
		runtimeVersion: "1.0.0",
	},
};
