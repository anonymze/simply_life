import { LinkProps } from "expo-router";


export interface Service {
	id: number;
	name: string;
	description: string;
	icon: string;
	link: LinkProps["href"] | null;
	theme?: string;
}

const services: Service[] = [
	{
		id: 1,
		name: "Planning pro",
		description: "Gérez votre planning professionnel",
		icon: "sports",
		link: "/test",
		theme: "text-purple-600",
	},
	{
		id: 2,
		name: "Rendez-vous médicaux",
		description: "Prenez vos rendez-vous médicaux",
		icon: "medical-services",
		link: "/sponsors",
		theme: "text-blue-500",
	},
	{
		id: 3,
		name: "Kiné",
		description: "Accédez à vos séances de kinésithérapie",
		icon: "fitness-center",
		link: "/login",
		theme: "text-green-500",
	},
	{
		id: 4,
		name: "Nutrition",
		description: "Suivez votre plan nutritionnel",
		icon: "restaurant",
		link: "/picker",
		theme: "text-green-600",
	},
	{
		id: 5,
		name: "Performance",
		description: "Suivez vos performances",
		icon: "emoji-events",
		link: null,
		theme: "text-red-500",
	},
	{
		id: 6,
		name: "Preparation mentale",
		description: "Accédez à votre préparation mentale",
		icon: "self-improvement",
		link: null,
		theme: "text-lime-600",
	},
	{
		id: 7,
		name: "Home tickets",
		description: "Gérez vos billets à domicile",
		icon: "local-activity",
		link: null,
		theme: "text-gray-700",
	},
	{
		id: 8,
		name: "Away tickets",
		description: "Gérez vos billets à l'extérieur",
		icon: "confirmation-number",
		link: null,
		theme: "text-gray-700",
	},
	{
		id: 9,
		name: "Chat",
		description: "Communiquez avec votre équipe",
		icon: "chat",
		link: null,
		theme: "text-yellow-500",
	},
	{
		id: 10,
		name: "Informations pratiques",
		description: "Accédez aux informations importantes",
		icon: "info",
		link: null,
		theme: "text-gray-900",
	},
	{
		id: 11,
		name: "Signature electronique",
		description: "Signez vos documents électroniquement",
		icon: "draw",
		link: null,
		theme: "text-gray-700",
	},
	{
		id: 12,
		name: "Coffre fort numérique",
		description: "Accédez à vos documents sécurisés",
		icon: "lock",
		link: null,
		theme: "text-blue-600",
	},
	{
		id: 13,
		name: "Coffre fort numérique",
		description: "Accédez à vos documents sécurisés",
		icon: "lock",
		link: null,
		theme: "text-blue-600",
	},
	{
		id: 14,
		name: "Coffre fort numérique",
		description: "Accédez à vos documents sécurisés",
		icon: "lock",
		link: null,
		theme: "text-blue-600",
	},
];

export default services;
