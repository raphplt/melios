import { useData } from "../context/DataContext";

const usePoints = () => {
	const { points, setPoints } = useData();

	const addOdysseePoints = (reward: number, difficulty: number) => {
		setPoints({
			...points,
			odyssee: Math.round(points.odyssee + reward * (difficulty / 2)),
		});
	};

	return { addOdysseePoints };
};

export default usePoints;
