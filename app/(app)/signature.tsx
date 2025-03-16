import { DOMLoading, DOMLoaderComponent } from "@/components/dom-loading";
import Animated, { FadeOut } from "react-native-reanimated";
import BackgroundLayout from "@/layouts/background-layout";
import { Text, ActivityIndicator } from "react-native";
import SignPdf from "@/components/sign-pdfjs";
import config from "@/tailwind.config";
import React from "react";


export default function Page() {
	return (
		<BackgroundLayout>
			<DOMLoading
				loaderComponent={<DOMLoaderComponent text="Chargement du PDF..." />}
				DomComponent={SignPdf}
			/>
		</BackgroundLayout>
	);
}
