import type { DOMProps } from "expo/dom";
import { sleep } from "@/utils/helper";
import { View } from "react-native";
import React from "react";


interface Props {
	loaderComponent: React.ReactNode;
	// TODO: fix type
	DomComponent: React.ComponentType<any>;
	minimumDurationLoader?: number;
}

export default function DOMLoading({ loaderComponent, DomComponent, minimumDurationLoader = 800 }: Props) {
	const [loading, setLoading] = React.useState(false);
	const durationRef = React.useRef(0);

	return (
		<View className="flex-1">
			{loading && loaderComponent}
			<DomComponent 
				dom={{
					onLayout: () => {
						durationRef.current = Date.now();
						setLoading(true);
					},
					onLoadEnd: async () => {
						const time = Date.now() - durationRef.current;
						if (time < minimumDurationLoader) await sleep(minimumDurationLoader - time);
						setLoading(false);
					},
				}}
			/>
		</View>
	);
}
