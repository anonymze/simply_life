import { PaginatedResponse, SuccessCreateResponse } from "@/types/response";
import { ChatRoom, Message, MessageOptimistic } from "@/types/chat";
import * as ImagePicker from "expo-image-picker";
import { QueryKey } from "@tanstack/react-query";
import { Media } from "@/types/media";
import { User } from "@/types/user";

import { api } from "../_config";


export async function getMessagesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, chatId, maxMessages] = queryKey;

	// be careful it's a custom route, so it will not handle every params
	const response = await api.get<PaginatedResponse<Message | MessageOptimistic>>("/api/messages/by-room", {
		params: {
			where: {
				chat_room: {
					equals: chatId,
				},
			},
			sort: "-createdAt",
			limit: maxMessages,
		},
	});

	return response.data.docs;
}

export async function createMessageQuery(params: MessageOptimistic) {
	const response = await api.post("/api/messages", {
		app_user: params.app_user.id,
		chat_room: params.chat_room,
		message: params.message,
		file: params.file,
	});
	return response.data;
}

// use fetch for file upload polyfill
const createMessageWithFileQuery = async (
	asset: ImagePicker.ImagePickerAsset,
	appUserId: User["id"],
	chatRoomId: ChatRoom["id"],
) => {
	const formData = new FormData();

	formData.append("file", {
		uri: asset.uri,
		name: asset.fileName ?? "file.jpg",
		type: asset.mimeType ?? "image/jpeg",
	} as any);

	formData.append("app_user", appUserId);
	formData.append("chat_room", chatRoomId);

	const response = await fetch((process.env.EXPO_PUBLIC_API_URL || "") + "/api/messages/with-file", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) throw new Error(await response.text());
	return response.json() as Promise<SuccessCreateResponse<Media>>;
};
