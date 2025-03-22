import { PaginatedResponse } from "@/types/response";
import { SponsorCategory } from "@/types/sponsor";

import { api } from "../_config";


export async function savePDFSignatureQuery({ file }: { file: string[] }) {
	const response = await api.post<PaginatedResponse<SponsorCategory>>("/api/signature/pdf", { file });
	return response.data;
}
