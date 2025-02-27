import { SafeAreaView } from "react-native-safe-area-context";
import Sign from "@/components/signature";


export default function Page() {
	return (
		<SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
			<Sign text="Signer au dessus" onOK={() => {}} />
		</SafeAreaView>
	);
}
