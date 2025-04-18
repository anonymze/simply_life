import { ActivityIndicator, Button, SafeAreaView, StyleSheet, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useTransition } from "react";


function TransitionScreen() {
	const [count, setCount] = useState(0);
	const [slowCount, setSlowCount] = useState(0);
	const [isPending, startTransition] = useTransition();


  for (let index = 0; index < 20000; index++) {
    console.log(index)
  }

  useFocusEffect(
    () => {
      console.log('focused')
      // Do something when the screen is focused
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
        console.log('unfocused')
      };
    }
  );

  React.useEffect(() => {
    console.log('mounted')

    return () => {
      console.log('unmounted')
    }
  }, [])
  
	const handleIncrement = () => {
		setCount((prevCount) => prevCount + 1);

		startTransition(() => {
			setSlowCount((prevSlowCount) => prevSlowCount + 1);
		});
	};
	return (
		<SafeAreaView>
			<CounterNumber count={count} />
			<SlowComponent count={slowCount} />
			{isPending ? <ActivityIndicator size="large" color="#0000ff" /> : null}
			<Button onPress={handleIncrement} title="Increment" />
		</SafeAreaView>
	);
}
export default TransitionScreen;

const CounterNumber = ({ count }: { count: number }) => {
	return <Text>{count}</Text>;
};

const SlowComponent = ({ count }: { count: number }) => {
	return <Text>{count}</Text>;
};
