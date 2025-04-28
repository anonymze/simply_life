import { User } from "./user";


export interface ChatRoom {
	id: string;
	app_user: User["id"]
	name: string;
	description: string | null;
	private: boolean | null;
	color: string | null;
	category: string | null;
	createdAt: string;
	updatedAt: string;
}


export interface Message {
	id: string;
	app_user: User;
	chat_room: ChatRoom["id"];
	message: string;
	createdAt: string;
	updatedAt: string;
}

export interface MessageOptimistic {
	id: Message["id"];
	app_user: User;
	chat_room: ChatRoom["id"];
	message: Message["message"];
	optimistic: boolean;
	createdAt: Message["createdAt"];
}

