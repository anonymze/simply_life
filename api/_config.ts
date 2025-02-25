import axios from "axios";


export const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || "",
	timeout: 90 * 1000, // 90 seconds because mobile can have slow connexion
	responseType: "json",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
	},
});
