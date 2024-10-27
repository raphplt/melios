export type Pack = {
	name: string;
	description: string;
	image?: string;
	color?: string;
	price: number;
	items?: PackItem[];
};

export type PackItem = {
	title: string;
	description: string;
	image?: string;
	icon?: string;
	trick?: string;
};
