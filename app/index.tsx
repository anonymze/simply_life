import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import CardLink from "@/components/card-link";
import services from "@/services/services";
import { Text, View } from "react-native";


export default function Index() {
	return (
		<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
			<BackgroundLayout className="p-4">
				<View className="flex-1 gap-4">
					{services.map((service) => (
						<CardLink key={service.id} service={service} />
					))}
				</View>
			</BackgroundLayout>
		</ScrollView>
	);
}
