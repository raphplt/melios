export type Goal = {
	id: string;
	memberId: string;
	habitId: string;
	duration: number;
	createdAt: {
		seconds: number;
		nanoseconds: number;
	};
};
