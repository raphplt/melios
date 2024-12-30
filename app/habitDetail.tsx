import { useEffect, useRef, useState } from "react";
import {
	View,
	AppState,
	AppStateStatus,
	StatusBar,
	Platform,
	StyleSheet,
} from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";

// Customs imports
import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import { formatTime } from "@utils/timeUtils";
import { lightenColor } from "@utils/colors";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { useHabits } from "@context/HabitsContext";
import { useTimer } from "@context/TimerContext";
import useHabitTimer from "@hooks/useHabitTimer";
import ButtonBack from "@components/Shared/ButtonBack";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonsBox from "@components/HabitDetail/ButtonsBox";
import { useTheme } from "@context/ThemeContext";
import SettingsButton from "@components/HabitDetail/SettingsButton";
import getImage from "@utils/getImage";
import CachedImage from "@components/Shared/CachedImage";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { currentHabit } = useHabits();

	if (!currentHabit) return <LoaderScreen text="Chargement des détails..." />;

	// Contexts
	const { theme } = useTheme();
	const { timerSeconds, isTimerActive } = useTimer();
	const { startTimer } = useHabitTimer();
	const { sendPushNotification } = useNotifications();
	const { expoPushToken } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const appState = useRef(AppState.currentState);
	const { categories } = useHabits();

	useEffect(() => {
		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange
		);
		return () => subscription.remove();
	}, []);

	const handleAppStateChange = async (nextAppState: AppStateStatus) => {
		if (
			appState.current.match(/inactive|background/) &&
			nextAppState === "active"
		) {
			const remainingSeconds = await AsyncStorage.getItem("timerSeconds");
			if (remainingSeconds) {
				startTimer(currentHabit);
			}
		} else if (nextAppState === "background") {
			if (!expoPushToken) {
				throw new Error("No expoPushToken");
			}
			sendPushNotification(expoPushToken, {
				title: `${currentHabit.name || "Habitude"} en pause`,
				body: `Cliquez pour revenir sur votre habitude en cours.`,
			});
			if (isTimerActive) {
				await AsyncStorage.setItem("timerSeconds", timerSeconds.toString());

				await Notifications.scheduleNotificationAsync({
					content: {
						title: "Minuteur en cours",
						body: `Il reste ${formatTime(
							timerSeconds
						)} pour compléter votre habitude.`,
					},
					trigger: null,
				});
			}
		}
		appState.current = nextAppState;
	};

	const lightenedColor = lightenColor(
		currentHabit.color || theme.colors.primary,
		0.1
	);

	const habitCategory = categories.find(
		(c) => c.category === currentHabit.category
	);

	const [imageUri, setImageUri] = useState<string | null>(null);

	useEffect(() => {
		const loadCategoryImage = async () => {
			if (habitCategory) {
				const uri = getImage(habitCategory.slug);
				setImageUri(uri);
			}
		};
		loadCategoryImage();
	}, [habitCategory]);

		const dark = theme.dark;
		const textColor = dark ? theme.colors.textSecondary : theme.colors.text;

		return (
			<View style={{ flex: 1 }}>
				<CachedImage
					imagePath={imageUri || "images/categories/fitness.jpg"}
					blurRadius={15}
					style={StyleSheet.absoluteFill}
				/>

				<View
					className="flex flex-row items-center justify-between w-11/12 mx-auto p-2 mt-4 mb-2"
					style={{
						paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
					}}
				>
					<ButtonBack handleQuit={() => navigation.goBack()} color={textColor} />
					<SettingsButton />
				</View>
				<View className="w-full mx-auto flex justify-center flex-col">
					<HabitDetailHeader habit={currentHabit} lightenedColor={lightenedColor} />

					<InfosPanel habit={currentHabit} lightenedColor={lightenedColor} />
					<LastDays habit={currentHabit} />
					<ButtonsBox />
				</View>
			</View>
		);
}
