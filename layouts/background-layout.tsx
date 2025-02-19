import { cn } from "@/utils/libs/tailwind";
import { View } from "react-native";


export default function BackgroundLayout({ children, className }: { children: React.ReactNode, className?: string }) {
	return (
		<View className={cn("flex-1 bg-background", className)}>
			{children}
		</View>
	);
}