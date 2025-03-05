"use dom";

import React, { useState, useRef, useEffect } from "react";
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Button, Image, Modal, Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function SignPdf({}: { dom: import("expo/dom").DOMProps }) {
	const [signatureImage, setSignatureImage] = useState<string | null>(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [signaturePosition, setSignaturePosition] = useState({ x: 100, y: 100 });
	const containerRef = useRef<HTMLDivElement>(null);
	const [signatures, setSignatures] = useState<Array<{id: string, uri: string, x: number, y: number}>>([]);
	const [activeSignature, setActiveSignature] = useState<string | null>(null);
	const [startPos, setStartPos] = useState({ x: 0, y: 0 });
	
	// Pick image from library
	const pickImage = async () => {
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 1],
			quality: 1,
		});

		if (!result.canceled && result.assets[0].uri) {
			setSignatureImage(result.assets[0].uri);
			setModalVisible(false);
			
			// Add signature to the list
			const newSignature = {
				id: Date.now().toString(),
				uri: result.assets[0].uri,
				x: signaturePosition.x,
				y: signaturePosition.y
			};
			
			setSignatures([...signatures, newSignature]);
		}
	};

	// Set up mouse event handlers
	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (activeSignature && containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				const deltaX = e.clientX - startPos.x;
				const deltaY = e.clientY - startPos.y;
				
				setSignatures(signatures.map(sig => 
					sig.id === activeSignature 
						? { ...sig, x: sig.x + deltaX, y: sig.y + deltaY } 
						: sig
				));
				
				setStartPos({ x: e.clientX, y: e.clientY });
			}
		};
		
		const handleMouseUp = () => {
			setActiveSignature(null);
		};
		
		if (activeSignature) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}
		
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [activeSignature, signatures, startPos]);

	// Handle mouse down on signature
	const handleMouseDown = (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		setActiveSignature(id);
		setStartPos({ x: e.clientX, y: e.clientY });
	};

	// Handle click on PDF to place signature
	const handlePdfClick = (e: React.MouseEvent) => {
		// Only handle clicks directly on the container or viewer
		if (e.target === containerRef.current || 
			(e.target as HTMLElement).closest('.rpv-core__viewer')) {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				setSignaturePosition({
					x: e.clientX - rect.left,
					y: e.clientY - rect.top
				});
				setModalVisible(true);
			}
		}
	};

	// const defaultLayoutPluginInstance = defaultLayoutPlugin();

	return (
		<>
			<div 
				ref={containerRef} 
				style={{ position: 'relative', height: "750px", width: "100%" }}
				onClick={handlePdfClick}
			>
				<Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
					<Viewer
						fileUrl={require("@/assets/pdfs/test.pdf")}
						// plugins={[defaultLayoutPluginInstance]}
						defaultScale={SpecialZoomLevel.PageFit}
					/>
				</Worker>
				
				{/* Render all signatures */}
				{signatures.map(sig => (
					<div
						key={sig.id}
						onMouseDown={(e) => handleMouseDown(e, sig.id)}
						style={{
							position: 'absolute',
							left: `${sig.x}px`,
							top: `${sig.y}px`,
							zIndex: 1000,
							cursor: activeSignature === sig.id ? 'grabbing' : 'grab',
							touchAction: 'none'
						}}
					>
						<img 
							src={sig.uri} 
							style={{ 
								width: '200px',
								userSelect: 'none',
								pointerEvents: 'none'
							}} 
							alt="Signature" 
						/>
					</div>
				))}
			</div>

			{/* Signature Modal */}
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
			>
				<View className="flex-1 justify-center items-center bg-black/50">
					<View className="bg-white p-5 rounded-lg w-4/5">
						<Text className="text-lg font-bold mb-4">Add Signature</Text>
						
						{signatureImage && (
							<Image
								source={{ uri: signatureImage }}
								className="h-20 w-full mb-4"
								resizeMode="contain"
							/>
						)}
						
						<Button title="Select Image" onPress={pickImage} />
						
						<View className="flex-row justify-end mt-4">
							<Pressable
								onPress={() => setModalVisible(false)}
								className="px-4 py-2 mr-2"
							>
								<Text>Cancel</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</>
	);
}
