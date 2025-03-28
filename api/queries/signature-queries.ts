import { PaginatedResponse } from "@/types/response";
import { SponsorCategory } from "@/types/sponsor";

import { api } from "../_config";


export async function savePDFSignatureQuery({ files }: { files: string[] }) {
	const response = await api.post<PaginatedResponse<SponsorCategory>>("/api/signature/pdf", { files });
	return response.data;
}

