import { api } from "../_config";


export async function savePDFSignatureQuery({ files }: { files: string[] }) {
	const response = await api.post("/api/signature/pdf", { files });
	return response.data;
}

