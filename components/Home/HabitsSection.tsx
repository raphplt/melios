import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import useIndex from "@hooks/useIndex";
import { UserHabit } from "@type/userHabit";
import { DayOfWeek } from "@type/days";
import SectionWrapper from "./SectionWrapper";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import NoHabits from "./NoHabits";
import { useTranslation } from "react-i18next";
import { CategoryTypeSelect } from "@components/Select/Containers/CategoriesList";

export default function HabitsSection() {
	const { userHabits } = useIndex();
	const { theme } = useTheme();
	const { t } = useTranslation();

	//TODO a corriger
	const [filter, setFilter] = useState<CategoryTypeSelect | null>(null);

	const today: DayOfWeek = new Date()
		.toLocaleString("en-US", { weekday: "long" })
		.toLowerCase() as DayOfWeek;

	const filteredHabits = userHabits?.filter(
		(habit) => habit.type === filter && habit.frequency && habit.frequency[today]
	);

	const morningHabits = filteredHabits?.filter(
		(habit) => habit.moment >= 6 && habit.moment < 12
	);

	const afternoonHabits = filteredHabits?.filter(
		(habit) => habit.moment >= 12 && habit.moment < 18
	);

	const eveningHabits = filteredHabits?.filter((habit) => habit.moment >= 18);

	const freeHabits = filteredHabits?.filter(
		(habit: UserHabit) => habit.moment === -1 || habit.moment < 6
	);

	if (!userHabits || userHabits.length == 0) return <NoHabits />;

	return (
		<ScrollView>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					marginVertical: 10,
				}}
			>
				<Pressable
					onPress={() => setFilter(CategoryTypeSelect.positive)}
					style={{ marginHorizontal: 10 }}
				>
					<Text
						style={{
							color: CategoryTypeSelect.positive
								? theme.colors.primary
								: theme.colors.text,
						}}
					>
						Positives
					</Text>
				</Pressable>

				<Pressable
					onPress={() => setFilter(CategoryTypeSelect.negative)}
					style={{ marginHorizontal: 10 }}
				>
					<Text
						style={{
							color: CategoryTypeSelect.negative
								? theme.colors.primary
								: theme.colors.text,
						}}
					>
						Negatives
					</Text>
				</Pressable>
			</View>

			{/* Morning routine */}
			{morningHabits && morningHabits.length > 0 && (
				<SectionWrapper
					title={t("morning_routine")}
					icon={
						<Iconify
							icon="solar:sunrise-bold"
							size={24}
							color={theme.colors.textTertiary}
						/>
					}
				>
					{morningHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</SectionWrapper>
			)}

			{/* Afternoon routine */}
			{afternoonHabits && afternoonHabits.length > 0 && (
				<SectionWrapper
					title={t("afternoon_routine")}
					icon={
						<Iconify
							icon="mingcute:sun-fill"
							size={24}
							color={theme.colors.textTertiary}
						/>
					}
				>
					{afternoonHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</SectionWrapper>
			)}

			{/* Evening routine */}
			{eveningHabits && eveningHabits.length > 0 && (
				<SectionWrapper
					title={t("evening_routine")}
					icon={
						<Iconify
							icon="material-symbols:nights-stay"
							size={24}
							color={theme.colors.textTertiary}
						/>
					}
				>
					{eveningHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</SectionWrapper>
			)}

			{/* Free habits */}
			{freeHabits && freeHabits.length > 0 && (
				<SectionWrapper
					title={t("free_time_habits")}
					icon={
						<Iconify
							icon="mdi:calendar-blank"
							size={24}
							color={theme.colors.textTertiary}
						/>
					}
				>
					{freeHabits.map((habit, index) => (
						<CardCheckHabit key={index} habit={habit} />
					))}
				</SectionWrapper>
			)}
		</ScrollView>
	);
}
