import { Category } from "@type/category";
import { Habit, HabitType } from "@type/habit";
import { createContext, ReactNode, useContext, useState } from "react";

export type SelectContextProps = {
	type: HabitType;
	setType: (type: HabitType) => void;
	category: Category | null;
	setCategory: (category: Category) => void;
	habit: Habit | null;
	setHabit: (habit: Habit) => void;
};

export const SelectContext = createContext<SelectContextProps>({
	type: "Positif",
	setType: () => {},
	category: null,
	setCategory: () => {},
	habit: null,
	setHabit: () => {},
});

export const SelectProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<HabitType>("Positif");
	const [category, setCategory] = useState<Category | null>(null);
	const [habit, setHabit] = useState<Habit | null>(null);

	return (
		<SelectContext.Provider
			value={{
				type,
				setType,
				category,
				setCategory,
				habit,
				setHabit,
			}}
		>
			{children}
		</SelectContext.Provider>
	);
};

export const useSelect = () => {
	const context = useContext(SelectContext);

	if (!context) {
		throw new Error("useSelect must be used within a SelectProvider");
	}
	return context;
};
