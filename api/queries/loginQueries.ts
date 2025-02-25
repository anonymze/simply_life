import { AppUser } from "@/types/user";

import { api } from "../_config";


export async function loginQuery({ email, password }: { email: string, password: string }) {
	return api.post<AppUser>("/api/app_users/login", { email, password }, {
		withCredentials: false
	});
}
