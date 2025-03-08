export type Post = {
	slug: string;
	title: string;
	date: string;
	coverImage: string;
	author: string;
	excerpt: string;
	ogImage: string;
	content: string;
	preview?: boolean;
	imageCredit?: string;
	tags: string[];
	pinned?: boolean;
};
