import { useContext, memo } from "react";
import {
	View,
	Text,
	Pressable,
	StyleSheet,
	ImageBackground,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

// Custom imports
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import { HabitsContext, useHabits } from "@context/HabitsContext";
import { UserHabit } from "@type/userHabit";
import { BlurView } from "expo-blur";
import ZoomableView from "@components/Shared/ZoomableView";
import { catImgs } from "@utils/categoriesBg";

function Activity({ habit }: { habit: UserHabit }) {
	const { theme } = useTheme();
	const { categories } = useHabits();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { setCurrentHabit } = useContext(HabitsContext);

	const lighterColor = lightenColor(habit.color || theme.colors.text, 0.6);

	// Go to habit detail
	const goHabitDetail = () => {
		setCurrentHabit(habit);
		navigation.navigate("habitDetail");
	};

	const habitCategory = categories.find((c) => c.category === habit.category);

	return (
		<ZoomableView>
			<View className="h-64 w-40 mx-2 rounded-xl">
				<Pressable
					onPress={goHabitDetail}
					className="flex flex-col justify-between h-full"
				>
					<View
						style={{
							backgroundColor: lighterColor,
						}}
						className="h-14 rounded-t-lg"
					>
						<Text
							className="font-semibold w-2/3 italic ml-2 mt-2 text-[12px]"
							style={{
								color: theme.colors.text,
							}}
						>
							{habit.category.slice(0, 25) + (habit.category.length > 25 ? "..." : "")}
						</Text>
						<View
							className="px-2 py-1 rounded-bl-lg rounded-tr-lg"
							style={{
								backgroundColor: theme.colors.backgroundSecondary,
								position: "absolute",
								right: 0,
								top: 0,
							}}
						>
							<Text
								className="text-[13px] font-semibold w-fit h-fit"
								style={{
									color: theme.colors.text,
								}}
							>
								{habit.duration}''
							</Text>
						</View>
					</View>
					<View className="flex flex-col justify-evenly items-center rounded-b-lg bg-slate-20 flex-1">
						<ImageBackground
							source={catImgs[habitCategory?.slug || "sport"]}
							className="h-full w-full flex flex-col justify-center items-center"
						>
							<View className=" flex items-center justify-center w-10/12 px-1 py-2 rounded-lg overflow-hidden">
								<BlurView intensity={95} tint={"light"} style={styles.blurView} />
								<FontAwesome6
									name={habit.icon || "question"}
									size={24}
									color={habit.color || theme.colors.text}
								/>
								<Text
									className="text-md w-11/12 mx-auto font-semibold text-center py-2 h-12 text-[12px]"
									style={{
										color: "#121212",
									}}
									numberOfLines={2}
									ellipsizeMode="tail"
								>
									{habit.name}
								</Text>
							</View>
						</ImageBackground>
					</View>
				</Pressable>
			</View>
		</ZoomableView>
	);
}

export default memo(Activity);

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});
