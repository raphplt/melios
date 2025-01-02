import { useEffect, useRef, useState } from "react";
import {
	View,
	AppState,
	AppStateStatus,
	StatusBar,
	Platform,
	StyleSheet,
	ScrollView,
	Dimensions,
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
import { useTranslation } from "react-i18next";
import NegativeCounter from "@components/HabitDetail/NegativeCounter";

export interface DayStatus {
	date: string;
	done: boolean;
}

export default function HabitDetail() {
	const { currentHabit } = useHabits();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const appState = useRef(AppState.currentState);
	const { categories } = useHabits();

	if (!currentHabit) return <LoaderScreen text={t("loading")} />;

	const screenHeight = Dimensions.get("window").height; // Hauteur de l'écran

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
		<ScrollView
			style={{ flex: 1 }}
			contentContainerStyle={{
				minHeight: screenHeight,
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
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
			<View
				className="w-full mx-auto flex justify-center flex-col"
				style={{ flexGrow: 1 }}
			>
				<HabitDetailHeader />
				<InfosPanel />
				<NegativeCounter />
				<LastDays />
				<ButtonsBox />
			</View>
		</ScrollView>
	);
}
