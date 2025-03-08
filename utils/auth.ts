import { getLanguageCodeLocale } from "@/i18n/translations";
import { i18n } from "@/i18n/translations";
import { Href, router } from "expo-router";
import { Alert } from "react-native";

import { getStorageUserInfos, removeStorageUserInfos } from "./store";


/**
 * @description logout the user
 */
export const logout = ({ alert = false }: { alert?: boolean } = {}) => {
	removeStorageUserInfos();
	if (alert) {
		const languageCode = getLanguageCodeLocale();
		Alert.alert(i18n[languageCode]("SESSION_EXPIRED"), i18n[languageCode]("SESSION_EXPIRED_MESSAGE"));
	}
	router.replace("/login");
};