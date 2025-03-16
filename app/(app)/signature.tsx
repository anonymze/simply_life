import { DOMLoading, DOMLoaderComponent } from "@/components/dom-loading";
import { getLanguageCodeLocale, i18n } from "@/i18n/translations";
import BackgroundLayout from "@/layouts/background-layout";
import SignPdf from "@/components/sign-pdf/sign-pdf";
import React from "react";


export default function Page() {
	const languageCode = getLanguageCodeLocale();
	return (
		<BackgroundLayout>
			<DOMLoading
				loaderComponent={<DOMLoaderComponent text={i18n[languageCode]("PDF_LOADING")} />}
				DomComponent={SignPdf}
			/>
		</BackgroundLayout>
	);
}
