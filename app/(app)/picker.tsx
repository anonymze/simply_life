import BottomSheetModal from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetModal";
import { BottomSheetSelect } from "@/components/bottom-sheet-select";
import { View, Button } from "react-native";
import { useRef } from "react";


export default function Page() {
	const bottomSheetRef = useRef<BottomSheetModal>(null);


	const handleSelect = (item: any) => {
		console.log(item);
	};

	return (
    <View className="flex-1 items-center justify-center">
			</View>
	);
}
