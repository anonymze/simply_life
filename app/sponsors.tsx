import BackgroundLayout, { stylesLayout } from "@/layouts/background-layout";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Platform, View } from "react-native";


export default function Page() {
	return (
		<BackgroundLayout>
			<View className="flex-1">
				<MapView
					provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
					style={stylesLayout.full}
					loadingEnabled={true}
					loadingIndicatorColor="#666666"
					loadingBackgroundColor="#eeeeee"
				/>
			</View>
		</BackgroundLayout>
	);
}
