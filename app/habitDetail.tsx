import { useEffect, useRef, useState } from "react";
import {
	View,
	AppState,
	StatusBar,
	Platform,
	StyleSheet,
	ScrollView,
	Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";

// Customs imports
import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import { lightenColor } from "@utils/colors";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import { useHabits } from "@context/HabitsContext";
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
	const { categories } = useHabits();

	if (!currentHabit) return <LoaderScreen text={t("loading")} />;

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
			style={{
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
			showsVerticalScrollIndicator={false}
		>
			<CachedImage
				imagePath={imageUri || "images/categories/fitness.jpg"}
				blurRadius={15}
				style={StyleSheet.absoluteFill}
			/>

			<View className="flex flex-row items-center justify-between w-11/12 mx-auto p-2 mt-12 mb-2">
				<ButtonBack handleQuit={() => navigation.goBack()} color={textColor} />
				<SettingsButton />
			</View>
			<View
				className="w-full mx-auto flex justify-start flex-col"
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
