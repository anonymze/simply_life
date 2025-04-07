import { Text, View } from "react-native";


export default function Page() {
	return withWrapper(
		"test",
		"coucou",
		function TestComponent({data}) {
			return (
				<View>
					<Text>{ data }</Text>
				</View>
			);
		}
	);
}

const withWrapper = (test: string, coucou: string, Component: React.ComponentType<{ data: 'oui'}>) => {
	if (test === "test") {
		return (
			<View>
				<Text>test !!!!</Text>
			</View>
		);
	}

	if (coucou === "coucou") {
		return (
			<View>
				<Text>coucou !!!!</Text>
			</View>
		);
	}

	return <Component data="oui" />;
};
