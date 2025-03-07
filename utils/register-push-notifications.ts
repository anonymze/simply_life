import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import Constants from "expo-constants";
import config from "@/tailwind.config";
import * as Device from "expo-device";


export async function registerForPushNotificationsAsync() {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: config.theme.extend.colors.primary,
		});
	}

	if (!Device.isDevice) throw new Error("Must use physical device for push notifications");

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;

	if (existingStatus !== "granted") {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}

	if (finalStatus !== "granted") {
		Alert.alert("Permission not granted", "Please grant permission to receive push notifications");
	}

	const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

	if (!projectId) throw new Error("Project ID not found");

	try {
		const pushTokenString = (
			await Notifications.getExpoPushTokenAsync({
				projectId,
			})
		).data;
		return pushTokenString;
	} catch (e: unknown) {
		throw new Error(`${e}`);
	}
}
