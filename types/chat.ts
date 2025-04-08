import { User } from "./user";


export interface ChatRoom {
	id: string;
	app_user: User["id"]
	name: string;
	description: string | null;
	private: boolean | null;
	color: string | null;
	category: string | null;
	createdAt: Date;
	updatedAt: Date;
}


export interface Message {
	id: string;
	app_user: User["id"];
	chat_room: ChatRoom["id"];
	message: string;
	createdAt: Date;
	updatedAt: Date;
}



