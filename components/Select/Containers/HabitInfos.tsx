import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import SeparatorVertical from "@components/Shared/SeparatorVertical";
import { HabitInfoSection } from "../Items/HabitInfoSection";
import { useSelect } from "@context/SelectContext";
import ModalDuration from "../Modals/ModalDuration";
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
	const [showModalColor, setShowModalColor] = useState(false);
	const [showModalDuration, setShowModalDuration] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(habit?.category);
	const [selectedColor, setSelectedColor] = useState(habit?.color);
	const [selectedDuration, setSelectedDuration] = useState(habit?.duration || 0);

	// Elements dynamiques si c'est une habitude personnalisé
	const color = customHabit ? theme.colors.text : theme.colors.textTertiary;

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
				className="rounded-xl px-1 py-4 mt-4 flex flex-row items-center justify-between h-fit"
				style={{
					overflow: "hidden",
				}}
			>
				{/* Durée */}
				<HabitInfoSection
					icon={"stopwatch"}
					text={`${selectedDuration} min`}
					color={color}
					onPress={() => {
						setShowModalDuration(true);
					}}
				/>

				<SeparatorVertical color={theme.colors.textTertiary} />

				{/* Catégorie */}
				<HabitInfoSection
					icon={selectedCategory?.icon || "shapes"}
					text={selectedCategory?.category || "Personnalisé"}
					color={color}
					// onPress={handleShowModalCategory}
				/>

				<SeparatorVertical color={theme.colors.textTertiary} />

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

			<ModalDuration
				visible={showModalDuration}
				setVisible={setShowModalDuration}
				onChange={(label: string, value: number) => {
					setValue("duration", value);
					setSelectedDuration(value);
				}}
			/>

			<SelectColor
				visible={showModalColor}
				setVisible={setShowModalColor}
				setColor={setColor}
			/>
		</>
	);
}