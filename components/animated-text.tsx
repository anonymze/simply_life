import Animated, { FadeIn, FadeOut, LinearTransition, } from "react-native-reanimated";
import { StyleSheet, Text, TextProps } from "react-native";
import React, { useMemo } from "react";


interface CharacterObject {
  id: string;
  char: string;
}

const springConfig = {
  damping: 16,
  mass: 0.8,
  stiffness: 180,
};

// create a reusable layout transition
const springyLayout = LinearTransition.springify()
  .damping(springConfig.damping)
  .mass(springConfig.mass)
  .stiffness(springConfig.stiffness);

const AnimatedText = ({ children, ...rest }: TextProps & { children: string }) => {

  const splitText: CharacterObject[] = useMemo(() => {
    let commaCount = 0;
    return children
      .split("")
      .map((char, index) => ({
        id: char === "," ? `comma-${++commaCount}` : `${index}`,
        char,
      }));
  }, [children]);

  return (
    <Animated.View
      layout={springyLayout}
      style={styles.container}
    >
      {splitText.map(({ char, id }, index) => (
        <Animated.View
          entering={FadeIn.duration(100)}
          exiting={FadeOut.duration(100)}
          key={id}
          layout={springyLayout}
        >
          <Text {...rest} style={rest.style}>
            {char}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default React.memo(AnimatedText);