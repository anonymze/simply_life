import { getStorageUserInfos } from "@/utils/store";
import axios from "axios";


export const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || "",
	timeout: 60 * 1000, // 60 seconds because mobile can have slow connections
	responseType: "json",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		// Authorization: `JWT ${getStorageUserInfos()?.token}`,
	},
});
