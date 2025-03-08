import { NotificationProvider } from "@/context/push-notifications";
import HeaderLayout from "@/layouts/headert-layout";
import { getStorageUserInfos } from "@/utils/store";
import { Stack, Redirect } from "expo-router";


export default function AppLayout() {
	const userInfos = getStorageUserInfos();

	if (!userInfos || !userInfos.token) {
		return <Redirect href="/login" />;
	}

	return (
		<NotificationProvider>
			<Stack
				initialRouteName="index"
				screenOptions={{
					headerShown: true,
					gestureDirection: "horizontal",
					gestureEnabled: true,
					fullScreenGestureEnabled: true,
					gestureResponseDistance: {
						start: 0,
						end: 120,
					},
				}}
			>
				<Stack.Screen
					name="index"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="presentation"
					options={{
						headerShown: false,
					}}
				/>
				<Stack.Screen
					name="sponsors"
					options={{
						gestureEnabled: false,
						header: () => <HeaderLayout title="Sponsors" />,
					}}
				/>
				<Stack.Screen
					name="signature"
					options={{
						header: () => <HeaderLayout title="Signature" />,
					}}
				/>
				<Stack.Screen
					name="chat"
					options={{
						headerShown: false,
						header: () => <HeaderLayout title="Chat" />,
					}}
				/>
				<Stack.Screen
					name="performance"
					options={{
						header: () => <HeaderLayout title="Performance" />,
					}}
				/>
			</Stack>
		</NotificationProvider>
	);
}
