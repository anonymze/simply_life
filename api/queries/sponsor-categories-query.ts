import { PaginatedResponse } from "@/types/response";
import { SponsorCategory } from "@/types/sponsor";
import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getSponsorCategoriesQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get<PaginatedResponse<SponsorCategory>>("/api/sponsor-categories", { params: filters });
	return response.data;
}
