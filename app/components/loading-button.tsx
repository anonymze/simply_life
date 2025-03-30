import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { ActivityIndicator, Pressable, Text } from "react-native";
import React from "react";


type LoadingButtonProps = {
  onPress: () => void;
  isLoading: boolean;
  label: string;
  className?: string;
};

export const LoadingButton = React.memo(({ onPress, isLoading, label, className }: LoadingButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      className={`h-14 w-full items-center justify-center rounded-lg bg-primary disabled:opacity-70 ${className ?? ''}`}
    >
      {isLoading ? (
        <Animated.View entering={FadeInDown.springify().duration(1200)} exiting={FadeOutUp.duration(300)}>
          <ActivityIndicator size="small" color="white" />
        </Animated.View>
      ) : (
        <Text className="text-center text-white">{label}</Text>
      )}
    </Pressable>
  );
}); 