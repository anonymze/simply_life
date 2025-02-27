import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";
import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { useRef } from "react";


const Sign = ({ text, onOK }: { text: string; onOK: (signature: string) => void }) => {
	const ref = useRef<SignatureViewRef>(null);

	const handleOK = () => {
		onOK(ref.current?.readSignature() ?? "");
	};

	const handleClear = () => {
		ref.current?.clearSignature();
	};

	return (
		<View className="h-full w-full flex-1">
			<SignatureScreen
				ref={ref}
				webStyle={`
						.m-signature-pad--footer { display: none; }
						.m-signature-pad { border: none; box-shadow: none; width: 100%; height: 100%; }
						.m-signature-pad--body { flex:1, width: 100%; height: 100%; border: none; background-color: transparent; }
						canvas { width: 100%; height: 100%; }
					`}
				style={{ flex: 1, width: "100%", height: "100%" }}
			/>

			<View className="mb-2 w-full flex-row items-center justify-around">
				<Pressable
					onPress={handleClear}
					className="items-center justify-center px-4 py-2"
				>
					{({ pressed }) => (
						<Text className={`text-primary ${pressed ? 'opacity-50' : 'opacity-100'}`}>
							Effacer
						</Text>
					)}
				</Pressable>
				<Pressable
					onPress={handleOK}

				>
					{({ pressed }) => (
						<Text className={`text-primary ${pressed ? 'opacity-50' : 'opacity-100'}`}>
							Confirmer
						</Text>
					)}
				</Pressable>
			</View>
		</View>
	);
};

export default Sign;
