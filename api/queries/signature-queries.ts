import { api } from "../_config";


export async function savePDFSignatureQuery({ file }: { file: string[] }) {
	console.log("savePDFSignatureQuery");
	const response = await api.post("https://simply-life-admin.vercel.app/api/signature/pdf", { file });
	console.log(response);
	return response.data;
}
