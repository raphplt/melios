import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
	View,
	ScrollView,
	Dimensions,
	ImageBackground,
	StyleSheet,
	StatusBar,
	Platform,
} from "react-native";
import { useNavigation } from "expo-router";
import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import { useHabits } from "@context/HabitsContext";
import ButtonBack from "@components/Shared/ButtonBack";
import {
	NavigationProp,
	ParamListBase,
	StackActions,
} from "@react-navigation/native";
import ButtonsBox from "@components/HabitDetail/ButtonsBox";
import { useTheme } from "@context/ThemeContext";
import SettingsButton from "@components/HabitDetail/SettingsButton";
import { useTranslation } from "react-i18next";
import NegativeCounter from "@components/HabitDetail/NegativeCounter";
import { catImgs } from "@utils/categoriesBg";
import { getHabitLogs } from "@db/logs";
import Trophies from "@components/HabitDetail/Trophies";
import { useData } from "@context/DataContext";
import HabitDone from "@components/HabitDetail/HabitDone";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { currentHabit, categories } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { completedHabitsToday } = useData();

	const [habitLogs, setHabitLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	// useCallback pour mémoriser la fonction fetchLogs
	const fetchLogs = useCallback(async () => {
		if (!currentHabit) return;
		try {
			const logs = await getHabitLogs(currentHabit.id);
			setHabitLogs(logs || []);
		} catch (error) {
			console.error("Erreur lors de la récupération des logs :", error);
		} finally {
			setLoading(false);
		}
	}, [currentHabit]);

	useEffect(() => {
		if (currentHabit) {
			fetchLogs();
		}
	}, [currentHabit, fetchLogs]);

	// Utiliser useMemo pour calculer habitCategory & slug uniquement lorsque currentHabit ou categories changent
	const habitCategory = useMemo(() => {
		return (
			categories.find((c) => c.category === currentHabit?.category) ||
			categories.find((c) => c.slug === "other")
		);
	}, [categories, currentHabit]);

	const slug = useMemo(() => habitCategory?.slug || "sport", [habitCategory]);

	// Optimiser textColor avec useMemo
	const dark = theme.dark;
	const textColor = useMemo(
		() => (dark ? theme.colors.textSecondary : theme.colors.text),
		[dark, theme.colors]
	);

	// Calculer si l'habitude est complétée en utilisant useMemo
	const isHabitCompleted = useMemo(() => {
		return completedHabitsToday.some((habit) => habit.id === currentHabit?.id);
	}, [completedHabitsToday, currentHabit]);

	if (!currentHabit) return <LoaderScreen text={t("loading")} />;

	const screenHeight = Dimensions.get("screen").height;

	return (
		<ScrollView
			style={{
				flex: 1,
				minHeight: screenHeight,
			}}
			className="pb-10"
			showsVerticalScrollIndicator={false}
		>
			<ImageBackground
				source={catImgs[slug]}
				style={[StyleSheet.absoluteFillObject]}
			/>
			<View
				className="flex flex-row items-center justify-between w-11/12 mx-auto p-2 mb-2"
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
				}}
			>
				<ButtonBack
					handleQuit={() => navigation.dispatch(StackActions.replace("(navbar)"))}
					color={textColor}
				/>
				<SettingsButton />
			</View>
			<View
				className="w-full h-full mx-auto flex justify-start flex-col gap-2 "
				style={{ flexGrow: 1 }}
			>
				<HabitDetailHeader />
				{isHabitCompleted && <HabitDone />}
				<InfosPanel />
				<Trophies logs={habitLogs} loading={loading} />
				<NegativeCounter />
				<LastDays logs={habitLogs} loading={loading} />
				<ButtonsBox />
			</View>
		</ScrollView>
	);
}
