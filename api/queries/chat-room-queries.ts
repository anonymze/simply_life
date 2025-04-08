import { PaginatedResponse } from "@/types/response";
import { APIOmittedParams } from "@/types/payload";
import { QueryKey } from "@tanstack/react-query";
import { ChatRoom } from "@/types/chat";

import { api } from "../_config";


export async function getChatRoomsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<ChatRoom>>("/api/chat-rooms", { params: filters });
	return response.data;
}

export async function createChatRoomQuery(params: APIOmittedParams<ChatRoom>) {
	console.log(params);
	const response = await api.post("/api/chat-rooms", params);
	return response.data;
}
