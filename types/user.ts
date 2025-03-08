export interface AppUser {
	exp: number;
	token: string;
	user: User;
}

interface User {
	id: string;
	lastname: string;
	firstname: string;
	role: UserRole;
	email: string;
}

type UserRole = "coach" | "staff" | "player" | "visitor";
