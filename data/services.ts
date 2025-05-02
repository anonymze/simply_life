import { LinkProps } from "expo-router";


export interface Service {
	id: number;
	name: string;
	description: string;
	icon: string;
	link: LinkProps["href"] | null;
	theme?: string;
	pastille?: boolean;
}

const services: Service[] = [
	{
		id: 4,
		name: "Canaux de discussion / Chat",
		description: "Suivez votre plan nutritionnel",
		icon: require("@/assets/images/logo.png"),
		link: "/chat",
		theme: "text-green-600",
		pastille: true,
	},
	{
		id: 14,
		name: "Page de connexion",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
		pastille: true,
	},
	{
		id: 2,
		name: "Visionneuse PDF",
		description: "Prenez vos rendez-vous médicaux",
		icon: require("@/assets/images/logo.png"),
		link: "/signature",
		theme: "text-blue-500",
		pastille: true,
	},
	{
		id: 1,
		name: "Mes commissions",
		description: "Gérez votre planning professionnel",
		icon: require("@/assets/images/logo.png"),
		link: "/contact",
		theme: "text-purple-600",
	},

	{
		id: 11,
		name: "Fundesys",
		description: "Signez vos documents électroniquement",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-gray-700",
	},
	{
		id: 12,
		name: "Fidnet",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-blue-600",
	},
	{
		id: 8,
		name: "Vie d'agence",
		description: "Gérez vos billets à l'extérieur",
		icon: require("@/assets/images/logo.png"),
		link: "/test2",
		theme: "text-gray-700",
	},
	{
		id: 7,
		name: "Calendrier personnel",
		description: "Gérez vos billets à domicile",
		icon: require("@/assets/images/logo.png"),
		link: "/chat",
		theme: "text-gray-700",
	},

	{
		id: 9,
		name: "Réservations bureaux",
		description: "Communiquez avec votre équipe",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-yellow-500",
	},
	{
		id: 15,
		name: "Guide d'accueil",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
	},
	{
		id: 16,
		name: "Organigramme",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
	},
	{
		id: 17,
		name: "Demande d'immobiliers",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
	},
	{
		id: 13,
		name: "Concours indépendants",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-blue-600",
	},

	{
		id: 18,
		name: "Informations réunion",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
	},
];

export default services;
