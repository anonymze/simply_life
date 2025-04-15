import { PaginatedResponse } from "@/types/response";
import { APIOmittedParams } from "@/types/payload";
import { QueryKey } from "@tanstack/react-query";
import { Message } from "@/types/chat";

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

export async function createMessageQuery(params: APIOmittedParams<Message>) {
	const response = await api.post("/api/messages", params);
	return response.data;
}
