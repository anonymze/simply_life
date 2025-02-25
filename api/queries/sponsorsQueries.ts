import { QueryKey } from "@tanstack/react-query";

import { api } from "../_config";


export async function getSponsorsQuery({ queryKey }: { queryKey: QueryKey }) {
	const [, filters] = queryKey;
	const response = await api.get("/api/sponsors", { params: filters });
	return response.data;
}
