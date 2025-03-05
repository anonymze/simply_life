"use dom";

import React, { useRef } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function SignPdf({ dom , hello}: { dom: import("expo/dom").DOMProps, hello: string }) {
	console.log(dom);
	console.log(hello);
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
