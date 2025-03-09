import React, { useState, useMemo } from "react";
import { ScrollView, View } from "react-native";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import useIndex from "@hooks/useIndex";
import { DayOfWeek } from "@type/days";
import SectionWrapper from "./SectionWrapper";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import NoHabits from "./NoHabits";
import { useTranslation } from "react-i18next";
import { HabitType } from "@utils/category.type";
import FiltersHabits from "./FiltersHabits";
import NoNegativeHabits from "./NoNegativeHabit";

const HabitsSection = () => {
	const { userHabits } = useIndex();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [filter, setFilter] = useState<HabitType>(HabitType.positive);

	const today: DayOfWeek = useMemo(() => {
		return new Date()
			.toLocaleString("en-US", { weekday: "long" })
			.toLowerCase() as DayOfWeek;
	}, []);

	const categorizedHabits = useMemo(() => {
		if (!userHabits)
			return {
				filteredHabits: [],
				morning: [],
				afternoon: [],
				evening: [],
				free: [],
			};

		const filtered = userHabits.filter((habit) => {
			if (filter === HabitType.positive) {
				return (
					habit.type !== HabitType.negative &&
					habit.frequency &&
					habit.frequency[today]
				);
			}
			if (filter === HabitType.negative) {
				return (
					habit.type === HabitType.negative &&
					habit.frequency &&
					habit.frequency[today]
				);
			}
			return false;
		});

		if (filter === HabitType.positive) {
			return {
				filteredHabits: filtered,
				morning: filtered.filter((habit) => habit.moment >= 6 && habit.moment < 12),
				afternoon: filtered.filter(
					(habit) => habit.moment >= 12 && habit.moment < 18
				),
				evening: filtered.filter((habit) => habit.moment >= 18),
				free: filtered.filter((habit) => habit.moment === -1 || habit.moment < 6),
			};
		} else {
			return {
				filteredHabits: filtered,
				morning: [],
				afternoon: [],
				evening: [],
				free: [],
			};
		}
	}, [userHabits, filter, today]);

	if (!userHabits || userHabits.length === 0) return <NoHabits />;

	const {
		filteredHabits,
		morning: morningHabits,
		afternoon: afternoonHabits,
		evening: eveningHabits,
		free: freeHabits,
	} = categorizedHabits;

	return (
		<View style={{ flex: 1 }}>
			{/* Filtres */}
			<FiltersHabits filter={filter} setFilter={setFilter} />

			{/* Liste des habitudes */}
			<ScrollView>
				{filter === HabitType.negative ? (
					<View className="mt-4">
						{filteredHabits.map((habit) => (
							<CardCheckHabit key={habit.id || habit.name} habit={habit} />
						))}
					</View>
				) : (
					<>
						{/* Routine Matinale */}
						{morningHabits.length > 0 && (
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
								{morningHabits.map((habit) => (
									<CardCheckHabit key={habit.id || habit.name} habit={habit} />
								))}
							</SectionWrapper>
						)}

						{/* Routine de l'après-midi */}
						{afternoonHabits.length > 0 && (
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
								{afternoonHabits.map((habit) => (
									<CardCheckHabit key={habit.id || habit.name} habit={habit} />
								))}
							</SectionWrapper>
						)}

						{/* Routine du soir */}
						{eveningHabits.length > 0 && (
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
								{eveningHabits.map((habit) => (
									<CardCheckHabit key={habit.id || habit.name} habit={habit} />
								))}
							</SectionWrapper>
						)}

						{/* Habitudes libres */}
						{freeHabits.length > 0 && (
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
								{freeHabits.map((habit) => (
									<CardCheckHabit key={habit.id || habit.name} habit={habit} />
								))}
							</SectionWrapper>
						)}
					</>
				)}

				{filter === HabitType.negative && filteredHabits.length === 0 && (
					<NoNegativeHabits />
				)}
			</ScrollView>
		</View>
	);
};

export default React.memo(HabitsSection);