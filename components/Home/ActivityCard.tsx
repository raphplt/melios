import { useContext, useEffect, useState, useRef, memo } from "react";
import {
	View,
	Text,
	Pressable,
	Animated,
	Image,
	StyleSheet,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

// Custom imports
import { ThemeContext } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import { HabitsContext } from "@context/HabitsContext";
import { Habit } from "@type/habit";
import useIndex from "@hooks/useIndex";
import getImage from "@utils/getImage";
import { UserHabit } from "@type/userHabit";
import { BlurView } from "expo-blur";

function Activity({ habit }: { habit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<Habit>();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { setCurrentHabit } = useContext(HabitsContext);
	const { getHabitDetails } = useIndex();

	useEffect(() => {
		async function getHabitInfos() {
			const result = getHabitDetails(habit.id);
			setHabitInfos(result);
		}
		getHabitInfos();
	}, []);

	if (!habitInfos) return null;

	const lighterColor = lightenColor(
		habitInfos.category?.color || theme.colors.text,
		0.6
	);

	const handleTouchStart = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleTouchEnd = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	// Go to habit detail
	const goHabitDetail = () => {
		setCurrentHabit(habit);
		navigation.navigate("habitDetail");
	};

	return (
		<Animated.View
			className="h-64 w-40 mx-1 rounded-xl"
			style={{
				backgroundColor: theme.colors.background,
				transform: [{ scale: scaleAnim }],
			}}
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={handleTouchEnd}
		>
			<Pressable
				onPress={() => {
					goHabitDetail();
				}}
				className="flex flex-col justify-between h-full"
			>
				<View
					style={{
						backgroundColor: lighterColor,
					}}
					className="h-14 rounded-t-xl"
				>
					<View>
						<Text
							className="text-[14px] font-semibold right-2 top-2 absolute rounded-2xl px-2 py-[2px]"
							style={{
								color: theme.colors.text,
								backgroundColor: theme.colors.textSecondary,
							}}
						>
							{habitInfos.duration}''
						</Text>
					</View>
					<Text
						className="font-semibold w-3/5 italic ml-3 mt-2"
						style={{
							color: theme.colors.text,
						}}
					>
						{habitInfos.category?.category}
					</Text>
				</View>
				<View
					className="flex flex-col justify-evenly items-center rounded-b-xl bg-slate-20 flex-1
				"
				>
					<Image
						source={getImage(habitInfos.category.slug)}
						style={StyleSheet.absoluteFillObject}
						blurRadius={20}
						resizeMode="cover"
						className="w-full h-full rounded-b-xl"
					/>
					<View className=" flex items-center justify-center w-10/12 px-1 py-1 rounded-lg overflow-hidden">
						<BlurView intensity={60} tint={"light"} style={styles.blurView} />
						<Text
							className="text-md w-11/12 mx-auto font-semibold text-center py-1 text-[15px]"
							style={{
								color: "#121212",
							}}
							numberOfLines={1}
							ellipsizeMode="tail"
						>
							{habitInfos.name}
						</Text>
						<FontAwesome6
							name={habitInfos.category?.icon || "question"}
							size={32}
							color={habitInfos.category?.color || theme.colors.text}
						/>
					</View>
				</View>
			</Pressable>
		</Animated.View>
	);
}

export default memo(Activity);

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});
