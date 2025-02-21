import {
	View,
	ScrollView,
	Dimensions,
	ImageBackground,
	Text,
	StyleSheet,
} from "react-native";
import { useNavigation } from "expo-router";

import LoaderScreen from "@components/Shared/LoaderScreen";
import HabitDetailHeader from "@components/HabitDetail/HabitDetailHeader";
import InfosPanel from "@components/HabitDetail/InfosPanel";
import LastDays from "@components/HabitDetail/LastDays";
import { useHabits } from "@context/HabitsContext";
import ButtonBack from "@components/Shared/ButtonBack";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import ButtonsBox from "@components/HabitDetail/ButtonsBox";
import { useTheme } from "@context/ThemeContext";
import SettingsButton from "@components/HabitDetail/SettingsButton";
import { useTranslation } from "react-i18next";
import NegativeCounter from "@components/HabitDetail/NegativeCounter";
import { catImgs } from "@utils/categoriesBg";
import { Platform } from "react-native";

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

	const habitCategory =
		categories.find((c) => c.category === currentHabit.category) ||
		categories.find((c) => c.slug === "other");

	const dark = theme.dark;
	const textColor = dark ? theme.colors.textSecondary : theme.colors.text;

	const slug: string = habitCategory?.slug || "sport";

	console.log("platform", Platform.OS);

	const screenHeight = Dimensions.get("screen").height;

	return (
		<ScrollView
			style={{
				flex: 1,
				minHeight: screenHeight,
			}}
			showsVerticalScrollIndicator={false}
		>
			<ImageBackground
				source={catImgs[slug]}
				style={[StyleSheet.absoluteFillObject, { height: screenHeight }]}
			/>
			<View
				className="flex flex-row items-center justify-between w-11/12 mx-auto p-2 mb-2"
				style={{
					paddingTop: Platform.OS === "ios" ? 0 : 40,
				}}
			>
				<ButtonBack
					handleQuit={() => navigation.navigate("(navbar)")}
					color={textColor}
				/>
				<SettingsButton />
			</View>
			<View
				className="w-full mx-auto flex justify-between flex-col"
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