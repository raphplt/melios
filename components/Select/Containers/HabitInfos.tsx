import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import SeparatorVertical from "@components/Shared/SeparatorVertical";
import { HabitInfoSection } from "../Items/HabitInfoSection";
import { getTypeIcon } from "@utils/select/helper";
import { useSelect } from "@context/SelectContext";
import ModalCategory from "../Modals/ModalCategory";

export default function HabitInfos({
	habit,
	register,
	setValue,
}: {
	habit: Habit | null;
	register: any;
	setValue: any;
}) {
	const { theme } = useTheme();
	const { customHabit } = useSelect();

	const [showModalCategory, setShowModalCategory] = useState(false);
	const [showModalColor, setShowModalColor] = useState(false);

	const [selectedCategory, setSelectedCategory] = useState(habit?.category);

	// Elements dynamiques si c'est une habitude personnalisé
	const color = customHabit ? theme.colors.text : theme.colors.grayPrimary;
	const modalDisabled = customHabit ? false : true;

	// Fonction pour afficher modal catégorie
	const handleShowModalCategory = () => {
		if (!modalDisabled) {
			setShowModalCategory(true);
		}
	};

	useEffect(() => {
		setSelectedCategory(habit?.category);
	}, [habit]);

	return (
		<>
			<View
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				className="rounded-xl py-3 mt-4 flex flex-row items-center justify-between"
			>
				{/* Type */}
				<HabitInfoSection
					icon={getTypeIcon(habit?.type || "")}
					text={habit?.type || "Personnalisé"}
					color={color}
					onPress={() => {}}
				/>

				<SeparatorVertical color={theme.colors.grayPrimary} />

				{/* Catégorie */}
				<HabitInfoSection
					icon={selectedCategory?.icon || "shapes"}
					text={selectedCategory?.category || "Catégorie"}
					color={color}
					onPress={handleShowModalCategory}
				/>

				<SeparatorVertical color={theme.colors.grayPrimary} />

				{/* Couleur */}
				<View className="flex items-center justify-evenly flex-1">
					<View
						className="w-6 h-6 rounded-full"
						style={{
							backgroundColor: selectedCategory?.color || theme.colors.grayPrimary,
						}}
					/>
					<Text className="pt-2">{selectedCategory?.color || "Couleur"}</Text>
				</View>
			</View>

			<ModalCategory
				register={register}
				visible={showModalCategory}
				setVisible={setShowModalCategory}
				setValue={(name, value) => {
					setValue(name, value);
					if (name === "category") {
						setSelectedCategory(value);
					}
				}}
			/>
		</>
	);
}
