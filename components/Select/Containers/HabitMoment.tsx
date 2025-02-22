import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import RowTitleCustom from "../Items/RowTitleCustom";
import React from "react";
import { useTranslation } from "react-i18next";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolateColor,
} from "react-native-reanimated";

export default function HabitMoment({
	setValue,
	register,
}: {
	setValue: any;
	register: any;
}) {
	const { theme } = useTheme();
	const { habit } = useSelect();
	const { t } = useTranslation();

	const [selectedMoment, setSelectedMoment] = useState(habit?.moment || -1);
	const [visible, setVisible] = useState(false);
	const [customMoment, setCustomMoment] = useState<Date | null>(null);
	const [isCustom, setIsCustom] = useState(false);

	// Création d'une valeur partagée pour chaque bloc
	const progressCustom = useSharedValue(customMoment ? 1 : 0);
	const progressFree = useSharedValue(
		selectedMoment === -1 && !customMoment ? 1 : 0
	);
	const progressMorning = useSharedValue(
		selectedMoment >= 6 && selectedMoment < 12 && !customMoment ? 1 : 0
	);
	const progressAfternoon = useSharedValue(
		selectedMoment >= 12 && selectedMoment < 18 && !customMoment ? 1 : 0
	);
	const progressEvening = useSharedValue(
		selectedMoment >= 18 && selectedMoment < 24 && !customMoment ? 1 : 0
	);

	useEffect(() => {
		setValue("moment", selectedMoment);
	}, [selectedMoment, setValue]);

	// À chaque modification de l'état, on anime les valeurs partagées
	useEffect(() => {
		progressCustom.value = withTiming(customMoment ? 1 : 0, { duration: 300 });
		progressFree.value = withTiming(
			selectedMoment === -1 && !customMoment ? 1 : 0,
			{ duration: 300 }
		);
		progressMorning.value = withTiming(
			selectedMoment >= 6 && selectedMoment < 12 && !customMoment ? 1 : 0,
			{ duration: 300 }
		);
		progressAfternoon.value = withTiming(
			selectedMoment >= 12 && selectedMoment < 18 && !customMoment ? 1 : 0,
			{ duration: 300 }
		);
		progressEvening.value = withTiming(
			selectedMoment >= 18 && selectedMoment < 24 && !customMoment ? 1 : 0,
			{ duration: 300 }
		);
	}, [
		selectedMoment,
		customMoment,
		theme.colors.primary,
		theme.colors.cardBackground,
	]);

	const resetCustomMoment = () => {
		setCustomMoment(null);
	};

	const handleSelectMoment = (moment: number) => {
		resetCustomMoment();
		setSelectedMoment(moment);
		setIsCustom(false);
	};

	const handleCustomMoment = (date: Date) => {
		setCustomMoment(date);
		setSelectedMoment(date.getHours());
		setVisible(false);
		setIsCustom(true);
	};

	const blockStyle =
		"flex flex-row items-center justify-evenly flex-1 rounded-xl mx-2";
	const itemStyle =
		"w-full flex flex-row items-center justify-between px-3 py-2 rounded-xl";

	// Styles animés pour chaque bloc grâce à leur valeur partagée
	const animatedStyleCustom = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progressCustom.value,
			[0, 1],
			[theme.colors.cardBackground, theme.colors.primary]
		),
	}));

	const animatedStyleFree = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progressFree.value,
			[0, 1],
			[theme.colors.cardBackground, theme.colors.primary]
		),
	}));

	const animatedStyleMorning = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progressMorning.value,
			[0, 1],
			[theme.colors.cardBackground, theme.colors.primary]
		),
	}));

	const animatedStyleAfternoon = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progressAfternoon.value,
			[0, 1],
			[theme.colors.cardBackground, theme.colors.primary]
		),
	}));

	const animatedStyleEvening = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progressEvening.value,
			[0, 1],
			[theme.colors.cardBackground, theme.colors.primary]
		),
	}));

	return (
		<>
			<RowTitleCustom title="MOMENT" />
			<View className="flex flex-row items-center justify-between pb-1">
				<Animated.View className={blockStyle} style={[animatedStyleCustom]}>
					<Pressable className={itemStyle} onPress={() => setVisible(true)}>
						<Text
							className="py-2 text-[14px] mx-auto"
							style={{
								color: isCustom ? theme.colors.background : theme.colors.text,
							}}
						>
							{(customMoment && moment(customMoment).format("HH:mm")) ||
								"Personnalisée"}
						</Text>
						<Iconify
							icon="fluent:chevron-right-24-filled"
							size={20}
							color={isCustom ? theme.colors.background : theme.colors.text}
						/>
					</Pressable>
				</Animated.View>

				{/* Bloc pour free_time */}
				<Animated.View className={blockStyle} style={[animatedStyleFree]}>
					<Pressable
						className={itemStyle}
						onPress={() => handleSelectMoment(-1)}
						{...register("moment")}
					>
						<Text
							className="py-2 text-[14px]"
							style={{
								color:
									selectedMoment === -1 && !customMoment
										? theme.colors.background
										: theme.colors.text,
							}}
						>
							{t("free_time")}
						</Text>
						<Iconify
							icon="tabler:time-duration-off"
							size={20}
							color={
								selectedMoment === -1 && !customMoment
									? theme.colors.background
									: theme.colors.text
							}
						/>
					</Pressable>
				</Animated.View>
			</View>

			{/* Bas : blocs pour morning, afternoon et evening */}
			<View className="flex flex-row items-center justify-between py-2">
				{/* Bloc morning */}
				<Animated.View className={blockStyle} style={[animatedStyleMorning]}>
					<Pressable
						className={itemStyle}
						onPress={() => handleSelectMoment(7)}
						{...register("moment")}
					>
						<Text
							className="py-2 text-[14px]"
							style={{
								color:
									selectedMoment >= 6 && selectedMoment < 12 && !customMoment
										? theme.colors.background
										: theme.colors.text,
							}}
						>
							{t("morning")}
						</Text>
						<Iconify
							icon="ph:sun-horizon"
							size={20}
							color={
								selectedMoment >= 6 && selectedMoment < 12 && !customMoment
									? theme.colors.background
									: theme.colors.text
							}
						/>
					</Pressable>
				</Animated.View>

				{/* Bloc afternoon */}
				<Animated.View className={blockStyle} style={[animatedStyleAfternoon]}>
					<Pressable
						className={itemStyle}
						onPress={() => handleSelectMoment(12)}
						{...register("moment")}
					>
						<Text
							className="py-2 text-[14px]"
							style={{
								color:
									selectedMoment >= 12 && selectedMoment < 18 && !customMoment
										? theme.colors.background
										: theme.colors.text,
							}}
						>
							{t("afternoon")}
						</Text>
						<Iconify
							icon="ph:sun"
							size={20}
							color={
								selectedMoment >= 12 && selectedMoment < 18 && !customMoment
									? theme.colors.background
									: theme.colors.text
							}
						/>
					</Pressable>
				</Animated.View>

				{/* Bloc evening */}
				<Animated.View className={blockStyle} style={[animatedStyleEvening]}>
					<Pressable
						className={itemStyle}
						onPress={() => handleSelectMoment(18)}
						{...register("moment")}
					>
						<Text
							className="py-2 text-[14px]"
							style={{
								color:
									selectedMoment >= 18 && selectedMoment < 24 && !customMoment
										? theme.colors.background
										: theme.colors.text,
							}}
						>
							{t("evening")}
						</Text>
						<Iconify
							icon="ph:moon"
							size={20}
							color={
								selectedMoment >= 18 && selectedMoment < 24 && !customMoment
									? theme.colors.background
									: theme.colors.text
							}
						/>
					</Pressable>
				</Animated.View>
			</View>

			{/* Sélecteur de date pour l'heure personnalisée */}
			{visible && (
				<RNDateTimePicker
					mode="time"
					value={customMoment || new Date()}
					onChange={(e, date) => {
						if (date) {
							setVisible(false);
							handleCustomMoment(date);
						} else {
							setVisible(false);
						}
					}}
				/>
			)}
		</>
	);
}
