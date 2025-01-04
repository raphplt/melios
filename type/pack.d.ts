export type Pack = {
	name: string;
	description: string;
	price: number;
	image: string;
	category: string;
	color: string;
	content: {
		sections: Section[];
	};
};

type Section = {
	title: string;
	details: string[];
};
