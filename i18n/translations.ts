import type { I18n } from "@/types/i18n";
import { sprintf } from "@/utils/helper";

import langs from "./langs";


const i18n: Record<I18n, (str: keyof typeof langs[I18n], ...args: string[]) => string> = {
	en: (str, ...args) => sprintf(langs.en[str], ...args),
	fr: (str, ...args) => sprintf(langs.fr[str], ...args),
};

export { i18n };