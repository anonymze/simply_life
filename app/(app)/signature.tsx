import Animated, { FadeOut } from "react-native-reanimated";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, ActivityIndicator } from "react-native";
import DOMLoading from "@/components/dom-loading";
import SignPdf from "@/components/sign-pdfjs";
import config from "@/tailwind.config";
import React from "react";


export default function Page() {
	return (
		<BackgroundLayout>
			<DOMLoading
				loaderComponent={
					<Animated.View
						exiting={FadeOut}
						className="absolute inset-0 z-10 flex items-center justify-center bg-background"
					>
						<ActivityIndicator size="large" color={config.theme.extend.colors.primary} />
						<Text className="mt-4 font-medium text-black">Chargement du PDF...</Text>
					</Animated.View>
				}
				domComponent={SignPdf}
			/>
		</BackgroundLayout>
	);
}
