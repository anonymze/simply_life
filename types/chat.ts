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
	app_user: User["id"];
	chat_room: ChatRoom | ChatRoom["id"];
	message: string;
	createdAt: string;
	updatedAt: string;
}

export interface MessageOptimistic extends Omit<Message, "updatedAt"> {
	optimistic: boolean;
}

