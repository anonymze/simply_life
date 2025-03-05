import { SafeAreaView } from "react-native-safe-area-context";
import SignPdfJs from "@/components/sign-pdfjs";


export default function Page() {

	const getSignature = (signature: string) => {
		console.log(signature);
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
			{/* <Sign text="Signer au dessus" onOK={getSignature} /> */}
			<SignPdfJs dom={{}} />
		</SafeAreaView>
	);
}
