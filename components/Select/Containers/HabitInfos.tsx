import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import SeparatorVertical from "@components/Shared/SeparatorVertical";
import { HabitInfoSection } from "../Items/HabitInfoSection";
import { getTypeIcon } from "@utils/select/helper";
import { useSelect } from "@context/SelectContext";
import ModalCategory from "../Modals/ModalCategory";
import SelectColor from "@components/Modals/SelectColor";
import { BlurView } from "expo-blur";

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

	// States
	const [showModalCategory, setShowModalCategory] = useState(false);
	const [showModalColor, setShowModalColor] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(habit?.category);
	const [selectedColor, setSelectedColor] = useState(habit?.color);

	// Elements dynamiques si c'est une habitude personnalisé
	const color = customHabit ? theme.colors.text : theme.colors.textTertiary;
	const modalDisabled = customHabit ? false : true;

	// Fonction pour afficher modal catégorie
	const handleShowModalCategory = () => {
		if (!modalDisabled) {
			setShowModalCategory(true);
		}
	};

	const setCategory = (category: any) => {
		setValue("category", category);
		setSelectedCategory(category);
	};

	const setColor = (color: string) => {
		setValue("color", color);
		setSelectedColor(color);
	};

	useEffect(() => {
		setSelectedCategory(habit?.category);
	}, [habit]);

	return (
		<>
			<BlurView
				intensity={90}
				className="rounded-xl px-4 py-4 mt-4 flex flex-row items-center justify-between h-fit"
				style={{
					overflow: "hidden",
				}}
			>
				{/* Type */}
				<HabitInfoSection
					icon={getTypeIcon(habit?.type || "")}
					text={habit?.type || "Positive"}
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
				<Pressable
					className="flex items-center justify-evenly flex-1"
					onPress={() => {
						setShowModalColor(true);
					}}
				>
					<View
						className="w-6 h-6 rounded-full"
						style={{
							backgroundColor:
								selectedColor || habit?.category.color || theme.colors.grayPrimary,
						}}
					/>
					<Text
						className="pt-2 text-center w-10/12 font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						Couleur
					</Text>
				</Pressable>
			</BlurView>

			<ModalCategory
				register={register}
				visible={showModalCategory}
				setVisible={setShowModalCategory}
				setValue={setCategory}
			/>

			<SelectColor
				visible={showModalColor}
				setVisible={setShowModalColor}
				setColor={setColor}
			/>
		</>
	);
}