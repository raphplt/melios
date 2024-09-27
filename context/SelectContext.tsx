import { Category } from "@type/category";
import { HabitType } from "@type/habit";
import { createContext, ReactNode, useContext, useState } from "react";

export type SelectContextProps = {
	type: HabitType;
	setType: (type: HabitType) => void;
	category: Category | null;
	setCategory: (category: Category) => void;
};

export const SelectContext = createContext<SelectContextProps>({
	type: "Positif",
	setType: () => {},
	category: null,
	setCategory: () => {},
});

export const SelectProvider = ({ children }: { children: ReactNode }) => {
	const [type, setType] = useState<HabitType>("Positif");
	const [category, setCategory] = useState<Category | null>(null);

	return (
		<SelectContext.Provider value={{ type, setType, category, setCategory }}>
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
