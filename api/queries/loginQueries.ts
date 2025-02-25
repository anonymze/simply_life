import { api } from "../_config";


export async function loginQuery({ email, password }: { email: string, password: string }) {
	return api.post("/api/login", { email, password });
}
