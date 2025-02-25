export interface AppUser {
	exp: number;
	token: string;
	user: User;
}

interface User {
	id: number;
	lastname: string;
	firstname: string;
	role: "coach" | "staff" | "player" | "visitor";
	email: string;
}
