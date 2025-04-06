import { Text as RNText, TextProps } from "react-native";
import React from "react";


interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

export function Text({ children, ...props }: CustomTextProps) {
  return (
    <RNText className="text-white" {...props}>
      {children}
    </RNText>
  );
}

