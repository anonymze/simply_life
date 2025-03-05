import { SafeAreaView } from "react-native-safe-area-context";
import Sign from "@/components/signature-canvas";
import SignPdf from "@/components/sign-pdf";


export default function Page() {

	const getSignature = (signature: string) => {
		console.log(signature);
	};

	return (
		<SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
			{/* <Sign text="Signer au dessus" onOK={getSignature} /> */}
			<SignPdf dom={{}} />
		</SafeAreaView>
	);
}
