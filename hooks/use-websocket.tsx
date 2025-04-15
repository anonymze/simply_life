import React, { useEffect, useRef, useState } from "react";


const useWebSocket = (
	onMessage?: (messageEvent: MessageEvent) => void,
	onError?: (error: Event) => void,
	onClose?: (event: CloseEvent) => void
) => {
	const [webSocketConnected, setWebSocketConnected] = useState(false);
	const ws = useRef<WebSocket | null>(null);
	const reconnectIntervalRef = useRef(1000);
	const url = process.env.WEBSOCKET_URL;

	const connectWebSocket = () => {
		try {
			if (!url) throw new Error("No websocket url");
			// create a WebSocket connection
			ws.current = new WebSocket(url);

			// webSocket event listeners
			ws.current.onopen = () => {
				setWebSocketConnected(true);
				reconnectIntervalRef.current = 1000;
			};

			ws.current.onmessage = (event) => {
				onMessage?.(event.data);
			};

			ws.current.onerror = (error) => {
				onError?.(error);
			};

			ws.current.onclose = (event) => {
				setWebSocketConnected(false);
				onClose?.(event);
				// attempt to reconnect
				setTimeout(() => {
					reconnectIntervalRef.current = Math.min(reconnectIntervalRef.current * 2, 30000); // exponential backoff, max 30 seconds
					connectWebSocket();
				}, reconnectIntervalRef.current);
			};
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		connectWebSocket();
		// clean up WebSocket connection on component unmount
		return () => {
			if (!ws.current) return;
			ws.current.close();
		};
	}, [url]);

	return webSocketConnected;
};

export default useWebSocket;
