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
		name: "Commisions indépendants",
		description: "Gérez votre planning professionnel",
		icon: require("@/assets/images/logo.png"),
		link: "/presentation",
		theme: "text-purple-600",
	},
	{
		id: 2,
		name: "Fournisseurs",
		description: "Prenez vos rendez-vous médicaux",
		icon: require("@/assets/images/logo.png"),
		link: "/sponsors",
		theme: "text-blue-500",
	},
	{
		id: 3,
		name: "Partenaires",
		description: "Accédez à vos séances de kinésithérapie",
		icon: require("@/assets/images/logo.png"),
		link: "/signature",
		theme: "text-green-500",
	},
	{
		id: 4,
		name: "Messagerie",
		description: "Suivez votre plan nutritionnel",
		icon: require("@/assets/images/logo.png"),
		link: "/chat",
		theme: "text-green-600",
	},
	{
		id: 5,
		name: "Commissions associés",
		description: "Suivez vos performances",
		icon: require("@/assets/images/logo.png"),
		link: "/performance",
		theme: "text-red-500",
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
		id: 8,
		name: "Calendrier groupe valorem",
		description: "Gérez vos billets à l'extérieur",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-gray-700",
	},
	{
		id: 9,
		name: "Rendez-vous",
		description: "Communiquez avec votre équipe",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-yellow-500",
	},
	{
		id: 10,
		name: "Vie d'agence",
		description: "Accédez aux informations importantes",
		icon: require("@/assets/images/logo.png"),
		link: null,
		theme: "text-gray-900",
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
		name: "Demandes immobiliers",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: null,
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
		id: 14,
		name: "Contacts utiles",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
		theme: "text-blue-600",
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
		name: "Lettres de mission",
		description: "Accédez à vos documents sécurisés",
		icon: require("@/assets/images/logo.png"),
		link: "/login",
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
