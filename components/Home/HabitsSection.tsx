import React, { useState, useMemo } from "react";
import { ScrollView, View } from "react-native";
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

	const today: DayOfWeek = useMemo(() => {
		return new Date()
			.toLocaleString("en-US", { weekday: "long" })
			.toLowerCase() as DayOfWeek;
	}, []);

	const filteredHabits = useMemo(() => {
		if (!userHabits) return [];
		return userHabits.filter((habit) => {
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
	}, [userHabits, filter, today]);

	// Groupes d'habitudes par moment de la journée
	const morningHabits = useMemo(
		() =>
			filteredHabits.filter((habit) => habit.moment >= 6 && habit.moment < 12),
		[filteredHabits]
	);

	const afternoonHabits = useMemo(
		() =>
			filteredHabits.filter((habit) => habit.moment >= 12 && habit.moment < 18),
		[filteredHabits]
	);

	const eveningHabits = useMemo(
		() => filteredHabits.filter((habit) => habit.moment >= 18),
		[filteredHabits]
	);

	const freeHabits = useMemo(
		() =>
			filteredHabits.filter(
				(habit: UserHabit) => habit.moment === -1 || habit.moment < 6
			),
		[filteredHabits]
	);

	if (!userHabits || userHabits.length === 0) return <NoHabits />;

	return (
		<View style={{ flex: 1 }}>
			{/* Filtres */}
			<FiltersHabits filter={filter} setFilter={setFilter} />

			{/* Liste des habitudes */}
			<ScrollView>
				{filter === CategoryTypeSelect.negative ? (
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

				{filter === CategoryTypeSelect.negative && filteredHabits.length === 0 && (
					<NoNegativeHabits />
				)}
			</ScrollView>
		</View>
	);
}
