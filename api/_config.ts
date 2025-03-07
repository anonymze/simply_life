import { getStorageUserInfos, removeStorageUserInfos } from "@/utils/store";
import axios, { isAxiosError } from "axios";
import { router } from "expo-router";
import { Alert } from "react-native";


const ORIGIN_MOBILE = "simply-life-app://mobile";

export const api = axios.create({
	baseURL: process.env.EXPO_PUBLIC_API_URL || "",
	timeout: 60 * 1000, // 60 seconds because mobile can have slow connections
	responseType: "json",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		Origin: ORIGIN_MOBILE,
	},
	// enables sending cookies with cross-origin requests - required for authentication
	withCredentials: true,
});

// add response interceptor for errors
api.interceptors.response.use(
	(response) => response, // return successful responses as-is
	(error) => {
		if (!isAxiosError(error)) return Promise.reject(error);

		if (error.response?.status === 403) {
			const userInfos = getStorageUserInfos();

			console.log(userInfos);

			if (userInfos?.exp && userInfos.exp < Date.now() / 1000) {
				removeStorageUserInfos();
				router.replace("/login");
			}
		}

		// always reject the promise to let react query or other handlers process the error
		return Promise.reject(error);
	}
);
