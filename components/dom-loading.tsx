import { View } from "react-native";
import React from "react";


interface Props {
	loaderComponent: React.ReactNode;
	DomComponent: any;
	minimumDurationLoader?: number;
}

export default function DOMLoading({ loaderComponent, domComponent, minimumDurationLoader = 1000 }: Props) {
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
						console.log("onLayout");
						setLoading(true);
					},
					onLoadEnd: async () => {
						console.log("onLoadEnd", Date.now() - durationRef.current);
						if (Date.now() - durationRef.current > minimumDurationLoader) {
							console.log("onLoadEnd", Date.now() - durationRef.current);
							await new Promise((resolve) => setTimeout(resolve, 2000));
						}

						setLoading(false);
					},
				}}
			/>
		</View>
	);
}
