import Animated, { interpolate, useAnimatedRef, useAnimatedStyle, useScrollViewOffset } from "react-native-reanimated";
import { Dimensions, StyleSheet, View } from "react-native";
import { stylesLayout } from "@/layouts/background-layout";
import { LinearGradient } from "expo-linear-gradient";
import { SimpleLineIcons } from "@expo/vector-icons";
import type { PropsWithChildren } from "react";
import { Link } from "expo-router";
import { Image } from "expo-image";


const HEADER_HEIGHT = Dimensions.get("window").height / 1.8;

type Props = PropsWithChildren<{
	headerBackgroundColor: { start: string; end: string };
}>;

export default function ParallaxScrollView({ children, headerBackgroundColor }: Props) {
	const scrollRef = useAnimatedRef<Animated.ScrollView>();
	const scrollOffset = useScrollViewOffset(scrollRef);
	const headerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{
					translateY: interpolate(
						scrollOffset.value,
						[-HEADER_HEIGHT, 0, HEADER_HEIGHT],
						[-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
					),
				},
				{
					scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
				},
			],
		};
	});

	return (
		<View className="flex-1">
			<Animated.ScrollView
				ref={scrollRef}
				scrollEventThrottle={16}
				scrollIndicatorInsets={{ bottom: 0 }}
				contentContainerStyle={{ paddingBottom: 0 }}
			>
				<Animated.View style={[styles.header, headerAnimatedStyle]}>
					<LinearGradient style={styles.full} colors={[headerBackgroundColor.start, headerBackgroundColor.end]}>
						<Link
							href="../"
							className="absolute left-10 top-10 items-center justify-center rounded-md bg-white p-4 active:opacity-80"
						>
							<SimpleLineIcons name="arrow-left" size={18} color="black" />
						</Link>
						<View className="absolute h-full w-full items-center justify-center">
							<View className="h-32 w-32 rounded-xl bg-white px-4">
								<Image
									source={require("@/assets/images/logo-full.png")}
									contentFit="contain"
									style={stylesLayout.full}
								/>
							</View>
						</View>
					</LinearGradient>
				</Animated.View>
				<View className="flex-1 gap-4 overflow-hidden bg-background p-8">{children}</View>
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		height: HEADER_HEIGHT,
		overflow: "hidden",
	},
	full: {
		height: "100%",
		width: "100%",
	},
});
