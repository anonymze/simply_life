import { Message, MessageOptimistic } from "@/types/chat";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getMessagesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [,chatId, maxMessages] = queryKey;

	// be careful it's a custom route, so it will not handle every params
	const response = await api.get<PaginatedResponse<Message | MessageOptimistic>>("/api/messages/by-room", {
		params: {
			where: {
				chat_room: {
					equals: chatId
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

