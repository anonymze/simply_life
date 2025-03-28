import { getStorageUserInfos } from "@/utils/store";
import axios, { isAxiosError } from "axios";
import { logout } from "@/utils/auth";


const ORIGIN_MOBILE = "simply-life-app://mobile";

/**
 * @description WITHCREDENTIALS PROPERTY IS NEEDED TO SEND / STORE THE COOKIES
 * @description ON REACT NATIVE, AXIOS STORE THE COOKIES AUTOMATICALLY ON THE NATIVE NETWORK LAYER
 * @description ON REACT NATIVE, IT SEND THE COOKIES FROM THE NATIVE NETWORK LAYER
 */
export const api = axios.create({
	// TODO
	// baseURL: process.env.EXPO_PUBLIC_API_URL || "",
	baseURL: "http://localhost:3000",
	timeout: 60 * 1000, // 60 seconds because mobile can have slow connections
	responseType: "json",
	headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Origin": ORIGIN_MOBILE,
	},
	withCredentials: true,
});

// add response interceptor for errors
api.interceptors.response.use(
	(response) => response, // return successful responses as-is
	(error) => {
		if (!isAxiosError(error)) return Promise.reject(error);

		// if the user is not authenticated, or the token is expired, logout
		if (error.response?.status === 403) {
			const userInfos = getStorageUserInfos();
			if (userInfos?.exp && userInfos.exp < Date.now() / 1000) logout({ alert: true });
		}

		// always reject the promise to let react query or other handlers process the error
		return Promise.reject(error);
	},
);

