"use dom";

import "@/styles/app.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "./sign-pdf-layout.css";

import React, { useState, useEffect, useRef } from "react";
import type { DOMProps } from "expo/dom";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin, ToolbarProps } from "@react-pdf-viewer/default-layout";
import * as pdfjsLib from "pdfjs-dist";
import config from "@/tailwind.config";
import { ActivityIndicator } from "react-native";
import { I18n } from "@/types/i18n";
import { i18n } from "@/i18n/translations";

// dom props is needed otherwise the component crash
export default function SignPdf({ dom, languageCode }: { dom: DOMProps; languageCode: I18n }) {
	// Sample PDF URL - you can replace with your own
	const [pdfUrl, setPdfUrl] = useState(require("@/assets/pdfs/adobe.pdf"));
	const [signatureFieldCount, setSignatureFieldCount] = useState(0); // Only track signature field count
	const [isChecking, setIsChecking] = useState(true);
	const [signatureImage, setSignatureImage] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// THERE ARE HOOK CALLS DON'T BE FOOLED
	// Add the zoom plugin instance (need npm package @react-pdf-viewer/zoom)
	// const zoomPluginInstance = zoomPlugin();

	// create the scroll mode plugin (needed for enabling the scroll)
	// const scrollModePluginInstance = scrollModePlugin();

	// add the layout plugin instance
	const defaultLayoutPluginInstance = defaultLayoutPlugin({
		sidebarTabs: (_) => [],
		renderToolbar: (props) => ToolbarComponent(props, isChecking, signatureFieldCount, languageCode),
	});

	console.log(signatureFieldCount);

	useEffect(() => {
		// Set up PDF.js worker
		// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

		// Function to check for signature fields
		const checkForSignatureFields = async () => {
			try {
				setIsChecking(true);
				// Loading PDF to check for signature fields

				// For local files, we need to handle them differently
				let pdfData;
				try {
					// Try to fetch the PDF if it's a URL
					const response = await fetch(pdfUrl);
					pdfData = await response.arrayBuffer();
				} catch (error) {
					console.log("Could not fetch PDF as URL, using as is");
					pdfData = pdfUrl;
				}

				// Load the PDF document
				const loadingTask = pdfjsLib.getDocument(pdfData);
				const pdfDocument = await loadingTask.promise;

				// PDF loaded, checking for signature fields...
				let totalSignatureFields = 0;

				// Check each page for annotations (which include form fields)
				for (let i = 1; i <= pdfDocument.numPages; i++) {
					const page = await pdfDocument.getPage(i);
					const annotations = await page.getAnnotations();

					// Form fields are typically annotations with the 'Widget' subtype
					const formFieldAnnotations = annotations.filter((annotation) => annotation.subtype === "Widget");

					// Check for signature fields
					const signatureFields = formFieldAnnotations.filter(
						(annotation) =>
							annotation.fieldType === "Sig" ||
							(annotation.fieldName && annotation.fieldName.toLowerCase().includes("signature")),
					);

					if (signatureFields.length > 0) totalSignatureFields += signatureFields.length;
				}

				setSignatureFieldCount(totalSignatureFields);
			} catch (error) {
				console.error("Error checking for signature fields:", error);
				setSignatureFieldCount(0);
			} finally {
				setIsChecking(false);
			}
		};

		checkForSignatureFields();
	}, [pdfUrl]);

	const handleSignatureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				setSignatureImage(result);
				console.log("Signature image uploaded");
			};
			reader.readAsDataURL(file);
		}
	};

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	return (
		<div style={{ height: "100dvh", width: "100%" }}>
			<div style={{ height: "100%" }}>
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
					<Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} defaultScale={SpecialZoomLevel.PageFit} />
				</Worker>
			</div>
		</div>
	);
}

const ToolbarComponent = (
	Toolbar: (props: ToolbarProps) => React.ReactElement,
	isChecking: boolean,
	signatureFieldCount: number,
	languageCode: I18n,
) => {
	return (
		<Toolbar>
			{(slots) => {
				const { GoToNextPage, GoToPreviousPage, NumberOfPages, CurrentPageLabel, ZoomIn, ZoomOut } = slots;

				return (
					<>
						<style>
							{`
							.rpv-default-layout__toolbar {
								--rpv-default-layout__toolbar-background-color: ${config.theme.extend.colors.primary};
								--rpv-default-layout__toolbar-text-color: #fff;
							}
						`}
						</style>
						<div className="flex h-full w-full items-center justify-between px-4">
							<div className="flex items-center justify-center gap-0.5">
								<div className="w-[2ch]">
									<CurrentPageLabel />
								</div>
								<div className="w-[0.9rem]">/</div>
								<div className="w-[2ch]">
									<NumberOfPages />
								</div>
							</div>
							<div className="flex items-center font-bold">
								{isChecking ? (
									<ActivityIndicator />
								) : (
									`${signatureFieldCount} ${i18n[languageCode](signatureFieldCount > 1 ? "SIGNATURES" : "SIGNATURE")}`
								)}
							</div>
							<div className="flex items-center gap-1">
								<GoToPreviousPage>
									{(props) => (
										<button
											disabled={props.isDisabled}
											onClick={props.onClick}
											className="h-10 rounded px-2 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
										>
											<PreviousPageIcon />
										</button>
									)}
								</GoToPreviousPage>

								<GoToNextPage>
									{(props) => (
										<button
											disabled={props.isDisabled}
											onClick={props.onClick}
											className="h-10 rounded px-2 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
										>
											<NextPageIcon />
										</button>
									)}
								</GoToNextPage>
							</div>
							<div className="flex items-center gap-2">
								<ZoomOut>
									{(props) => (
										<button onClick={props.onClick} className="h-10 rounded px-2 text-white active:bg-black/25">
											<ZoomOutIcon />
										</button>
									)}
								</ZoomOut>
								<ZoomIn>
									{(props) => (
										<button onClick={props.onClick} className="h-10 rounded px-2 text-white active:bg-black/25">
											<ZoomInIcon />
										</button>
									)}
								</ZoomIn>
							</div>
						</div>
					</>
				);
			}}
		</Toolbar>
	);
};

const ZoomInIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-zoom-in"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" x2="16.65" y1="21" y2="16.65" />
			<line x1="11" x2="11" y1="8" y2="14" />
			<line x1="8" x2="14" y1="11" y2="11" />
		</svg>
	);
};

const ZoomOutIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-zoom-out"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" x2="16.65" y1="21" y2="16.65" />
			<line x1="8" x2="14" y1="11" y2="11" />
		</svg>
	);
};

const NextPageIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-chevron-down"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
};

const PreviousPageIcon = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="lucide lucide-chevron-up"
		>
			<path d="m18 15-6-6-6 6" />
		</svg>
	);
};
