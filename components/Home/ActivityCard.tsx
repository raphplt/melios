import { useContext, useEffect, useState, useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { UserHabit } from "../../type/userHabit";
import { ThemeContext } from "@context/ThemeContext";
import { getHabitById } from "@db/habits";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { lightenColor } from "@utils/colors";
import { HabitsContext } from "@context/HabitsContext";
import { Habit } from "@type/habit";

export default function Activity({ userHabit }: { userHabit: UserHabit }) {
	const { theme } = useContext(ThemeContext);
	const [habitInfos, setHabitInfos] = useState<Habit | null>(null);
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { setCurrentHabit } = useContext(HabitsContext);

	// Console log La !!!!!!!!!!! Changer ca immédiatement
	useEffect(() => {
		async function getHabitInfos() {
			const result = await getHabitById(userHabit.id);
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
		setCurrentHabit({
			habit: habitInfos,
			userHabit: userHabit,
		});
		navigation.navigate("habitDetail");
	};

	return (
		<Animated.View
			className="h-64 w-40 mx-2 rounded-xl"
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
			>
				<View
					style={{
						backgroundColor: lighterColor,
					}}
					className="h-14 rounded-t-xl"
				>
					<View>
						<Text
							className="text-[16px]  font-semibold right-2 top-2 absolute rounded-2xl px-2 py-[2px]"
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
				<LinearGradient
					colors={[theme.colors.background, lighterColor]}
					className="flex flex-col justify-around items-center mt-2 h-[192px] rounded-b-xl"
				>
					<Text
						className="text-md w-10/12 mx-auto font-semibold text-gray-900 text-center"
						style={{
							color: theme.colors.text,
						}}
					>
						{habitInfos.name}
					</Text>
					<FontAwesome6
						name={habitInfos.category?.icon || "question"}
						size={32}
						color={habitInfos.category?.color || theme.colors.text}
						style={{ marginRight: 10 }}
					/>
				</LinearGradient>
			</Pressable>
		</Animated.View>
	);
}
