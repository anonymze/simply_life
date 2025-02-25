import { MMKV } from "react-native-mmkv";


const storage = new MMKV();

export const AUTH_TOKEN_KEY = "auth_token";

export const getAuthToken = () => storage.getString(AUTH_TOKEN_KEY);
export const setAuthToken = (token: string) => storage.set(AUTH_TOKEN_KEY, token);
export const removeAuthToken = () => storage.delete(AUTH_TOKEN_KEY);

export default storage;


