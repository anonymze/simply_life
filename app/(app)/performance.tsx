import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import { Alert, ScrollView, Text, View } from "react-native";
import BackgroundLayout from "@/layouts/background-layout";
import { Button } from "react-native";
import React from "react";


export default function Page() {
	const [recognizing, setRecognizing] = React.useState(false);
	const [transcript, setTranscript] = React.useState("");

	useSpeechRecognitionEvent("start", () => setRecognizing(true));
	useSpeechRecognitionEvent("end", () => setRecognizing(false));
	useSpeechRecognitionEvent("result", (event) => {
		setTranscript(event.results[0]?.transcript);
	});
	useSpeechRecognitionEvent("error", (event) => {
		console.log("error code:", event.error, "error message:", event.message);
	});

	const handleStart = async () => {
		const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();

		if (!result.granted) {
			Alert.alert("Permissions not granted", result.status);
			return;
		}
		// Start speech recognition
		ExpoSpeechRecognitionModule.start({
			lang: "en-US",
			interimResults: true,
			maxAlternatives: 1,
			continuous: false,
			requiresOnDeviceRecognition: false,
			addsPunctuation: false,
			contextualStrings: [""],
		});
	};

	return (
		<BackgroundLayout>
			{!recognizing ? (
				<Button title="Start" onPress={handleStart} />
			) : (
				<Button title="Stop" onPress={() => ExpoSpeechRecognitionModule.stop()} />
			)}

			<ScrollView>
				<Text>{transcript}</Text>
			</ScrollView>
		</BackgroundLayout>
	);
}
