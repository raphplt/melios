import { Category } from "@type/category";
import { Habit, HabitType } from "@type/habit";
import { CategoryTypeSelect } from "@utils/category.type";
import { createContext, ReactNode, useContext, useState } from "react";

export type SelectContextProps = {
	type: HabitType;
	setType: (type: HabitType) => void;
	category: Category | null;
	setCategory: (category: Category) => void;
	habit: Habit | null;
	setHabit: (habit: Habit | null) => void;
	customHabit: boolean;
	setCustomHabit: (value: boolean) => void;
};

export const SelectContext = createContext<SelectContextProps>({
	type: CategoryTypeSelect.positive,
	setType: () => {},
	category: null,
	setCategory: () => {},
	habit: null,
	setHabit: () => {},
	customHabit: false,
	setCustomHabit: () => {},
});

export const SelectProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<HabitType>("Positif");
	const [category, setCategory] = useState<Category | null>(null);
	const [habit, setHabit] = useState<Habit | null>(null);
	const [customHabit, setCustomHabit] = useState(false);

	return (
		<SelectContext.Provider
			value={{
				type,
				setType,
				category,
				setCategory,
				habit,
				setHabit,
				customHabit,
				setCustomHabit,
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
