export const extractPoints = (snapshotRewards: any) => {
	return {
		rewards: snapshotRewards[0]?.rewards ?? 0,
		odyssee: snapshotRewards[0]?.odyssee ?? 0,
	};
};
