import React, { useState, useEffect } from "react";
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
	const { currentHabit } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { categories } = useHabits();
	const [habitLogs, setHabitLogs] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLogs = async () => {
			try {
				if (!currentHabit) return;
				const logs = await getHabitLogs(currentHabit.id);
				setHabitLogs(logs || []);
				setLoading(false);
			} catch (error) {
				console.error("Erreur lors de la récupération des logs :", error);
			}
		};

		if (currentHabit) {
			fetchLogs();
		}
	}, [currentHabit]);

	if (!currentHabit) return <LoaderScreen text={t("loading")} />;

	const habitCategory =
		categories.find((c) => c.category === currentHabit.category) ||
		categories.find((c) => c.slug === "other");

	const dark = theme.dark;
	const textColor = dark ? theme.colors.textSecondary : theme.colors.text;

	const slug: string = habitCategory?.slug || "sport";

	const screenHeight = Dimensions.get("screen").height;
	const { completedHabitsToday } = useData();

	const isHabitCompleted = completedHabitsToday.some(
		(habit) => habit.id === currentHabit?.id
	);

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
