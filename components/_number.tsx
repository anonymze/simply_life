// import AnimatedText from "@/components/animated-text";
// import Slider from "@react-native-community/slider";
// import { useTheme } from "@react-navigation/native";
// import { StyleSheet, View } from "react-native";
// import { useState } from "react";


// export default function Page() {
//   const [value, setValue] = useState(0);
//   const theme = useTheme();
//   return (
//     <View style={styles.container}>
//       <AnimatedText style={[styles.textStyle, { color: theme.colors.text }]}>
//         {value.toLocaleString("en-US", {
//           minimumFractionDigits: 0,
//           maximumFractionDigits: 2,
//         })}
//       </AnimatedText>
//       <Slider
//         style={{ width: "70%" }}
//         tapToSeek
//         minimumValue={0}
//         maximumValue={1_000_000}
//         value={value}
//         onValueChange={(value) => setValue(value)}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 80,
//   },
//   textStyle: {
//     fontSize: 60,
//     fontWeight: "700",
//     fontFamily: "Quicksand",
//   },
// });