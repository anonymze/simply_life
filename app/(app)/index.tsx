import BackgroundLayout from "@/layouts/background-layout";
import { ScrollView } from "react-native-gesture-handler";
import * as Sentry from "@sentry/react-native";
import CardLink from "@/components/card-link";
import { Button, View } from "react-native";
import services from "@/data/services";


export default function Page() {
	return (
		<View className="flex-1">
			<ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
				<BackgroundLayout className="p-4">
					<View className="flex-1 flex-row flex-wrap gap-4">
						{services.map((service) => (
							<CardLink key={service.id} service={service} />
						))}
					</View>
				</BackgroundLayout>
			</ScrollView>
		</View>
	);
}
