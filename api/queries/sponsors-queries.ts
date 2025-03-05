import { PaginatedResponse } from "@/types/response";
import { QueryKey } from "@tanstack/react-query";
import { Sponsor } from "@/types/sponsor";

import { api } from "../_config";


export async function getSponsorsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<Sponsor>>("/api/sponsors", { params: filters });
	return response.data;
}
