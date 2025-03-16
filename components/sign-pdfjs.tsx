"use dom";

import React from "react";
import type { DOMProps } from "expo/dom";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

// dom props is needed otherwise the component crash
export default function SignPdf({ hello }: { dom: DOMProps; hello: string }) {
	return (
		<div>
			<h1>gzergregerg</h1>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
			<p>egzergrgez</p>
		</div>
	);
}
