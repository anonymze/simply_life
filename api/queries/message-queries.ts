import { Message, MessageOptimistic } from "@/types/chat";
import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getMessagesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [,chatId, maxMessages] = queryKey;

	const response = await api.get<PaginatedResponse<Message>>("/api/messages", {
		params: {
			where: {
				chat_room: {
					equals: chatId
				},
			},
			sort: "createdAt",
			limit: maxMessages,
		},
	});
	
	return response.data.docs;
}

export async function createMessageQuery(params: MessageOptimistic) {
	const response = await api.post("/api/messages", {
		app_user: params.app_user,
		chat_room: params.chat_room,
		message: params.message,
	});
	return response.data;
}
