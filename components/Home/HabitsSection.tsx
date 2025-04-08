import React, { useState, useMemo } from "react";
import { ScrollView, Text, View } from "react-native";
import CardCheckHabit from "@components/Habit/CardCheckHabit";
import useIndex from "@hooks/useIndex";
import { DayOfWeek } from "@type/days";
import SectionWrapper from "./SectionWrapper";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import NoHabits from "./NoHabits";
import { useTranslation } from "react-i18next";
import ViewToggle, { ViewMode } from "./ViewToggle";
import CalendarView from "./CalendarView";
import AddHabits from "./AddHabits";

const HabitsSection = () => {
	const { userHabits } = useIndex();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.LIST);

	const today: DayOfWeek = useMemo(() => {
		return new Date()
			.toLocaleString("en-US", { weekday: "long" })
			.toLowerCase() as DayOfWeek;
	}, []);

	const categorizedHabits = useMemo(() => {
		if (!userHabits)
			return {
				morning: [],
				afternoon: [],
				evening: [],
				free: [],
			};

		const filtered = userHabits.filter(
			(habit) => habit.frequency && habit.frequency[today]
		);

		return {
			morning: filtered.filter((habit) => habit.moment >= 6 && habit.moment < 12),
			afternoon: filtered.filter(
				(habit) => habit.moment >= 12 && habit.moment < 18
			),
			evening: filtered.filter((habit) => habit.moment >= 18),
			free: filtered.filter((habit) => habit.moment === -1 || habit.moment < 6),
		};
	}, [userHabits, today]);

	if (!userHabits || userHabits.length === 0) return <NoHabits />;

	const {
		morning: morningHabits,
		afternoon: afternoonHabits,
		evening: eveningHabits,
		free: freeHabits,
	} = categorizedHabits;

	const noHabitsToday =
		morningHabits.length === 0 &&
		afternoonHabits.length === 0 &&
		eveningHabits.length === 0 &&
		freeHabits.length === 0;

	return (
		<View style={{ flex: 1 }}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 10,
				}}
			>
				<ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
				<AddHabits />
			</View>

			{viewMode === ViewMode.CALENDAR ? (
				<CalendarView habits={userHabits} />
			) : (
				<ScrollView>
					{noHabitsToday ? (
						<View style={{ padding: 20, alignItems: "center" }}>
							<Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>
								{t("no_habits_for_today")}
							</Text>
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
				</ScrollView>
			)}
		</View>
	);
};

export default React.memo(HabitsSection);