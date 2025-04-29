import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import { Directory, File, Paths } from "expo-file-system/next";
import { CheckCheckIcon } from "lucide-react-native";
import * as ContextMenu from "zeego/context-menu";
import { MessageOptimistic } from "@/types/chat";
import { FadeIn } from "react-native-reanimated";
import { CheckIcon } from "lucide-react-native";
import Animated from "react-native-reanimated";
import { i18n } from "@/i18n/translations";
import config from "@/tailwind.config";
import { Message } from "@/types/chat";
import { AppUser } from "@/types/user";
import { Media } from "@/types/media";
import { I18n } from "@/types/i18n";
import { Image } from "expo-image";
import { cn } from "@/utils/cn";
import React from "react";

import VideoScreen from "./video-screen";


const destination = new Directory(Paths.cache, "simply-life");
const widthWindow = Dimensions.get("window").width;
const heightWindow = Dimensions.get("window").height;


type ItemProps = {
	firstMessage: boolean;
	item: Message | MessageOptimistic;
	appUser: AppUser | null;
	stateMessage: {
		newMessageUser: boolean;
		lastMessageUser: boolean;
	};
	languageCode: I18n;
};

export const Item = React.memo(({ firstMessage, item, appUser, stateMessage, languageCode }: ItemProps) => {
	const me = item.app_user.id === appUser?.user.id;
	const optimistic = "optimistic" in item ? true : false;
	const [open, setOpen] = React.useState(false);

	return (
		<View
			className={cn(
				"my-[0.15rem] items-end gap-1",
				me ? "self-end" : "self-start",
				me ? "flex-row-reverse" : "flex-row",
				firstMessage && "mb-3",
				stateMessage.lastMessageUser && "mt-2.5",
			)}
		>
			{!me && (
				<Image
					placeholderContentFit="contain"
					placeholder={require("@/assets/icons/placeholder_user.svg")}
					source={item.app_user.photo?.url}
					style={{ width: 28, height: 28, borderRadius: 99, objectFit: "contain" }}
				/>
			)}
			<View
				className={cn(
					"flex-shrink flex-row gap-3 rounded-xl p-2.5",
					me ? "bg-greenChat" : "bg-grayChat",
					item.file && "p-1.5",
				)}
			>
				<View className="flex-shrink gap-1">
					{!me && stateMessage.lastMessageUser && (
						<Text className="text-sm font-bold text-primaryLight">{`${item.app_user.firstname} ${item.app_user.lastname}`}</Text>
					)}
					{item.message && <Text className="flex-shrink self-start text-white">{item.message}</Text>}
					{item.file ? (
						optimistic ? (
							<ActivityIndicator size="small" style={{ width: 140, height: 180, borderRadius: 6 }} color="#fff" />
						) : (
							<ContextMenu.Root
								onOpenChange={(open) => {
									setOpen(open);
								}}
							>
								<ContextMenu.Trigger
									onClick={() => {
										console.log("click");
									}}
								>
									<Animated.View style={{ width: 140, height: 180, borderRadius: 6 }} entering={FadeIn.duration(300)}>
										{(item.file as Media).mimeType?.startsWith("image") && (
											<Image
												placeholder={(item.file as Media).blurhash}
												placeholderContentFit="cover"
												source={(item.file as Media).url}
												transition={300}
												contentFit="cover"
												style={styles.image}
											/>
										)}
										{(item.file as Media).mimeType?.startsWith("video") && (
											<Image
												placeholder={(item.file as Media).blurhash}
												placeholderContentFit="cover"
												source={(item.file as Media).blurhash}
												transition={300}
												contentFit="cover"
												style={styles.image}
											/>
										)}
									</Animated.View>
								</ContextMenu.Trigger>
								<ContextMenu.Content>
									<ContextMenu.Preview>
										{(item.file as Media).mimeType?.startsWith("image") && (
											<Image
												source={(item.file as Media).url}
												contentFit="cover"
												style={{ width: widthWindow, height: heightWindow / 1.8, borderRadius: 6 }}
											/>
										)}

										{(item.file as Media).mimeType?.startsWith("video") && (
											<VideoScreen controls={open} width={widthWindow} height={heightWindow / 1.8} />
										)}
									</ContextMenu.Preview>
									<ContextMenu.Item
										key="download"
										onSelect={async () => {
											if (typeof item.file === "string" || !item.file?.url) return;

											try {
												if (!destination.exists) destination.create();
												const output = await File.downloadFileAsync(item.file.url, destination);
											} catch (error) {
												console.warn(error);
												// Alert.alert(
												// 	i18n[languageCode]("ERROR_GENERIC_PART1"),
												// 	i18n[languageCode]("ERROR_GENERIC_PART2"),
												// );
											}
										}}
									>
										<ContextMenu.ItemTitle>{i18n[languageCode]("DOWNLOAD")}</ContextMenu.ItemTitle>
										<ContextMenu.ItemIcon
											// androidIconName="arrow_down_float"
											ios={{
												name: "arrow.down",
												pointSize: 15,
												weight: "semibold",
												paletteColors: [
													{
														dark: config.theme.extend.colors.primaryLight,
														light: config.theme.extend.colors.primaryLight,
													},
												],
											}}
										/>
									</ContextMenu.Item>
								</ContextMenu.Content>
							</ContextMenu.Root>
						)
					) : null}
				</View>
				<View className={cn("flex-row gap-1 self-end", item.file && "absolute bottom-2 right-2")}>
					<Text className="text-xs text-gray-200">
						{new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
					</Text>
					{me &&
						(optimistic ? <CheckIcon size={14} color="#e5e5e5e5" /> : <CheckCheckIcon size={14} color="#55c0ff" />)}
				</View>
			</View>
		</View>
	);
});

// for debugging in react devtools
Item.displayName = "Item";

const styles = StyleSheet.create({
	image: {
		width: 140,
		height: 180,
		borderRadius: 6,
	},
});
