import { getMemberGoals } from "@db/goal";
import { Goal } from "@type/goal";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useData } from "./DataContext";

export type GoalContextProps = {
	goals: Goal[];
	setGoals: (goals: Goal[]) => void;
	loadingGoals: boolean;
	setLoadingGoals: (loading: boolean) => void;
};

export const GoalContext = createContext<GoalContextProps>({
	goals: [],
	setGoals: () => {},
	loadingGoals: false,
	setLoadingGoals: () => {},
});

export const GoalProvider = ({ children }: { children: ReactNode }) => {
	const [goals, setGoals] = useState<Goal[]>([]);
	const { member } = useData();
	const [loadingGoals, setLoadingGoals] = useState<boolean>(false);

	// Get goals
	useEffect(() => {
		try {
			const getGoals = async () => {
				if (!member?.uid) return;
				const snapshot = await getMemberGoals(member?.uid);
				setGoals(snapshot as any);
				setLoadingGoals(false);
			};
			getGoals();
		} catch (error) {
			console.error("Error while getting goals: ", error);
		}
	}, [member]);

	return (
		<GoalContext.Provider
			value={{ goals, setGoals, loadingGoals, setLoadingGoals }}
		>
			{children}
		</GoalContext.Provider>
	);
};

export const useGoal = () => {
	const context = useContext(GoalContext);
	if (!context) {
		throw new Error("useGoal must be used within a GoalProvider");
	}
	return context;
};
