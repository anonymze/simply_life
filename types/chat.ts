import { User } from "./user";


export interface ChatRoom {
	id: string;
	title: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
}


export interface Message {
	id: string;
	content: string;
	sender: User
	chatRoomId: ChatRoom["id"]
}


