import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Habit } from "@type/habit";
import SeparatorVertical from "@components/Shared/SeparatorVertical";
import { HabitInfoSection } from "../Items/HabitInfoSection";
import { useSelect } from "@context/SelectContext";
import ModalDuration from "../Modals/ModalDuration";
import SelectColor from "@components/Modals/SelectColor";
import { useTranslation } from "react-i18next";

export default function HabitInfos({
	habit,
	setValue,
}: {
	habit: Habit | null;
	setValue: any;
}) {
	const { theme } = useTheme();
	const { customHabit } = useSelect();
	const { t } = useTranslation();

	const [showModalColor, setShowModalColor] = useState(false);
	const [showModalDuration, setShowModalDuration] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(habit?.category);
	const [selectedColor, setSelectedColor] = useState(habit?.color);
	const [selectedDuration, setSelectedDuration] = useState(habit?.duration || 0);

	const color = customHabit
		? theme.colors.textTertiary
		: theme.colors.textTertiary;

	const setColor = (color: string) => {
		setValue("color", color);
		setSelectedColor(color);
	};

	useEffect(() => {
		setSelectedCategory(habit?.category);
	}, [habit]);

	return (
		<>
			<View
				className="rounded-xl px-1 py-4 mt-3 flex flex-row items-center justify-between h-fit"
				style={{
					backgroundColor: theme.colors.cardBackground,

					shadowColor: theme.colors.textTertiary,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 4,
					elevation: 3,
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
					color={theme.colors.textTertiary}
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
						{t("color")}
					</Text>
				</Pressable>
			</View>

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