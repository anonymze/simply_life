import { sleep } from "@/utils/helper";
import { View } from "react-native";
import React from "react";


interface Props {
	loaderComponent: React.ReactNode;
	DomComponent: any;
	minimumDurationLoader?: number;
}

export default function DOMLoading({ loaderComponent, domComponent, minimumDurationLoader = 800 }: Props) {
	const [loading, setLoading] = React.useState(false);
	const durationRef = React.useRef(0);
	const DomComponent = domComponent;

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
						if (Date.now() - durationRef.current < minimumDurationLoader) await sleep(minimumDurationLoader - (Date.now() - durationRef.current));
						setLoading(false);
					},
				}}
			/>
		</View>
	);
}
