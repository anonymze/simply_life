import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";
import { Pressable, View } from "react-native";
import { Text } from "react-native";
import { useRef } from "react";


const SIGNATURE_CANVAS_STYLE = `
  .m-signature-pad--footer { 
    display: none; 
  }
  .m-signature-pad { 
    width: 100%; 
    height: 100%; 
    border: 1px solid red; 
    box-shadow: none; 
  }
  .m-signature-pad--body { 
    width: 100%; 
    height: 100%; 
    border: none ; 
		box-shadow: none;
  }
  canvas 
	{ 
    width: 100%; 
    height: 100%; 
  }
  body { 
    width: 100%;
    height: 100%;
    margin: 0; 
    padding: 0; 
  }
`;

const Sign = ({ text, onOK }: { text: string; onOK: (signature: string) => void }) => {
	const ref = useRef<SignatureViewRef>(null);

	const handleClear = () => {
		ref.current?.clearSignature();
	};

	const handleConfirm = () => {
		ref.current?.readSignature();
	};

	return (
		<View
			style={{
				flex: 1,
			}}
		>
			<SignatureScreen
				ref={ref}
				onOK={onOK}
				webStyle={SIGNATURE_CANVAS_STYLE}
				style={{
					flex: 1,
					width: "100%",
					height: "100%",
				}}
				autoClear={false}
			/>

			<View className="mb-2 w-full flex-row items-center justify-around">
				<Pressable onPress={handleClear} className="items-center justify-center px-4 py-2">
					{({ pressed }) => <Text className={`text-primary ${pressed ? "opacity-50" : "opacity-100"}`}>Effacer</Text>}
				</Pressable>
				<Pressable onPress={handleConfirm}>
					{({ pressed }) => <Text className={`text-primary ${pressed ? "opacity-50" : "opacity-100"}`}>Confirmer</Text>}
				</Pressable>
			</View>
		</View>
	);
};

export default Sign;
