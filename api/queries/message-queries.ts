import { PaginatedResponse } from "@/types/response";
import { APIOmittedParams } from "@/types/payload";
import { QueryKey } from "@tanstack/react-query";
import { Message } from "@/types/chat";

import { api } from "../_config";


export async function getMessagesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Message>>("/api/messages", { params: filters });
	return response.data;
}

export async function createMessageQuery(params: APIOmittedParams<Message>) {
	const response = await api.post("/api/messages", params);
	return response.data;
}
