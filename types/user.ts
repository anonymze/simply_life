export interface AppUser {
	exp: number;
	token: string;
	user: User;
}

export interface User {
	id: string;
	lastname: string;
	firstname: string;
	email: string;
	role: UserRole;
	phone?: string;
	photo?: string;
}

type UserRole = "associate" | "independent" | "visitor" | "employee";

export const userHierarchy: Record<UserRole, number> = {
	associate: 0,
	employee: 1,
	independent: 2,
	visitor: 3,
} as const;
