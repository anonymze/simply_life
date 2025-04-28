import Animated, { withRepeat, withSequence, withTiming, useSharedValue } from "react-native-reanimated";
import { PropsWithChildren } from "react";


export default function HandShake({ children }: PropsWithChildren) {
	const shakeOffset = useSharedValue(0);

	const TIME = 80;
	const OFFSET = 5;

	const handSHake = () => {
		shakeOffset.value = withSequence(
			// withTiming(-OFFSET, { duration: TIME / 2 }),
			withRepeat(withTiming(OFFSET, { duration: TIME }), 4, true),
			// withTiming(0, { duration: TIME / 2 }),
		);
	};

	return <Animated.View style={{ transform: [{ translateX: shakeOffset }] }}>{children}</Animated.View>;
}
