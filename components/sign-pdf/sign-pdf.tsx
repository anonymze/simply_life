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

// dom props is needed otherwise the component crash
export default function SignPdf({ dom }: { dom: DOMProps; hello: string }) {
	// Sample PDF URL - you can replace with your own
	const [pdfUrl, setPdfUrl] = useState(require("@/assets/pdfs/adobe.pdf"));
	const [hasFormFields, setHasFormFields] = useState(false);
	const [hasSignatureFields, setHasSignatureFields] = useState(false);
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
		renderToolbar: ToolbarComponent,
	});

	useEffect(() => {
		// Set up PDF.js worker
		pdfjsLib.GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js";

		// Function to check for form fields
		const checkForFormFields = async () => {
			try {
				setIsChecking(true);
				console.log("Loading PDF to check for form fields...");

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

				console.log("PDF loaded, checking for form fields...");

				// Get the form fields using getAnnotations on each page
				let foundFormFields = false;
				let foundSignatureFields = false;

				// Check each page for annotations (which include form fields)
				for (let i = 1; i <= pdfDocument.numPages; i++) {
					const page = await pdfDocument.getPage(i);
					const annotations = await page.getAnnotations();

					// Form fields are typically annotations with the 'Widget' subtype
					const formFieldAnnotations = annotations.filter((annotation) => annotation.subtype === "Widget");

					if (formFieldAnnotations.length > 0) {
						console.log(`Found ${formFieldAnnotations.length} form fields on page ${i}`);
						foundFormFields = true;

						// Check for signature fields
						const signatureFields = formFieldAnnotations.filter(
							(annotation) =>
								annotation.fieldType === "Sig" ||
								(annotation.fieldName && annotation.fieldName.toLowerCase().includes("signature")),
						);

						if (signatureFields.length > 0) {
							console.log(`Found ${signatureFields.length} signature fields on page ${i}`);
							foundSignatureFields = true;
						}
					}
				}

				setHasFormFields(foundFormFields);
				setHasSignatureFields(foundSignatureFields);

				if (foundFormFields) {
					console.log("Form fields found!");
				} else {
					console.log("No form fields found in this PDF");
				}
			} catch (error) {
				console.error("Error checking for form fields:", error);
				setHasFormFields(false);
				setHasSignatureFields(false);
			} finally {
				setIsChecking(false);
			}
		};

		checkForFormFields();
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
			{/* <div style={{ padding: "10px", background: "#f0f0f0" }}>
				{isChecking ? (
					<p>Checking for fillable fields...</p>
				) : hasFormFields ? (
					<div>
						<p style={{ color: "green" }}>This PDF has fillable fields!</p>
						{hasSignatureFields && (
							<div>
								<p style={{ fontWeight: "bold" }}>Signature fields detected!</p>
								<button
									onClick={triggerFileInput}
									style={{
										padding: "8px 16px",
										backgroundColor: "#4CAF50",
										color: "white",
										border: "none",
										borderRadius: "4px",
										cursor: "pointer",
										marginTop: "8px",
									}}
								>
									Upload Signature Image
								</button>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleSignatureUpload}
									style={{ display: "none" }}
								/>
								{signatureImage && (
									<div style={{ marginTop: "10px" }}>
										<p>Signature Preview:</p>
										<img
											src={signatureImage}
											alt="Signature"
											style={{
												maxWidth: "200px",
												maxHeight: "100px",
												border: "1px solid #ccc",
											}}
										/>
										<p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
											This signature can be placed in the signature fields of this PDF.
										</p>
									</div>
								)}
							</div>
						)}
					</div>
				) : (
					<p>No fillable fields detected in this PDF.</p>
				)}
			</div> */}

			<div style={{ height: "100%" }}>
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
					<Viewer
						fileUrl={pdfUrl}
						plugins={[defaultLayoutPluginInstance]}
						onZoom={() => {
							console.log("zooming");
						}}
						defaultScale={SpecialZoomLevel.PageFit}
					/>
				</Worker>
			</div>
		</div>
	);
}

const ToolbarComponent = (Toolbar: (props: ToolbarProps) => React.ReactElement) => {
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
							<div className="flex items-center gap-2 w-14">
								<CurrentPageLabel /> <span> / </span> <NumberOfPages />
							</div>
							<div className="flex items-center gap-1">
								<GoToPreviousPage>
									{(props) => (
										<button
											disabled={props.isDisabled}
											onClick={props.onClick}
											className="rounded px-2 py-1 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
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
											className="rounded px-2 py-1 text-white active:bg-black/25 disabled:pointer-events-none disabled:opacity-50"
										>
											<NextPageIcon />
										</button>
									)}
								</GoToNextPage>
							</div>
							<div className="flex items-center gap-2">
								<ZoomOut>
									{(props) => (
										<button onClick={props.onClick} className="rounded px-2 py-1.5 text-white active:bg-black/25">
											<ZoomOutIcon />
										</button>
									)}
								</ZoomOut>
								<ZoomIn>
									{(props) => (
										<button onClick={props.onClick} className="rounded px-2 py-1.5 text-white active:bg-black/25">
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
