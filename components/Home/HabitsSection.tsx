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
import { CategoryTypeSelect } from "@utils/category.type";
import FiltersHabits from "./FiltersHabits";
import NoNegativeHabits from "./NoNegativeHabit";

export default function HabitsSection() {
	const { userHabits } = useIndex();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [filter, setFilter] = useState<CategoryTypeSelect>(
		CategoryTypeSelect.positive
	);

	const today: DayOfWeek = new Date()
		.toLocaleString("en-US", { weekday: "long" })
		.toLowerCase() as DayOfWeek;

	const filteredHabits = userHabits?.filter((habit) => {
		if (filter === CategoryTypeSelect.positive) {
			return (
				habit.type !== CategoryTypeSelect.negative &&
				habit.frequency &&
				habit.frequency[today]
			);
		}
		if (filter === CategoryTypeSelect.negative) {
			return (
				habit.type === CategoryTypeSelect.negative &&
				habit.frequency &&
				habit.frequency[today]
			);
		}
		return false;
	});

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
		<View style={{ flex: 1 }}>
			{/* Filtres */}
			<FiltersHabits filter={filter} setFilter={setFilter} />

			{/* Liste des habitudes */}
			<ScrollView>
				{filter === CategoryTypeSelect.negative ? (
					<View className="mt-4">
						{filteredHabits.map((habit, index) => (
							<CardCheckHabit key={index} habit={habit} />
						))}
					</View>
				) : (
					<>
						{/* Routine Matinale */}
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

						{/* Routine de l'après-midi */}
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

						{/* Routine du soir */}
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

						{/* Habitudes libres */}
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
					</>
				)}

				{filter === CategoryTypeSelect.negative && filteredHabits.length === 0 && (
					<NoNegativeHabits />
				)}
			</ScrollView>
		</View>
	);
}