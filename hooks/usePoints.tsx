import { useData } from "../context/DataContext";

const usePoints = () => {
	const { points, setPoints } = useData();

	const addOdysseePoints = (difficulty: number) => {
		setPoints({
			...points,
			odyssee: Math.round(points.odyssee + difficulty * 2),
		});
	};

	const addRewardPoints = (pointsToAdd: number) => {
		setPoints({
			...points,
			rewards: Math.round(points.rewards + pointsToAdd),
		});
	};

	return { addOdysseePoints, addRewardPoints };
};

export default usePoints;
