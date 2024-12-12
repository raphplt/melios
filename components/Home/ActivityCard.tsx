import { useContext, useRef, memo, useEffect, useState } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

// Custom imports
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import { HabitsContext, useHabits } from "@context/HabitsContext";
import getImage from "@utils/getImage";
import { UserHabit } from "@type/userHabit";
import { BlurView } from "expo-blur";
import CachedImage from "@components/Shared/CachedImage";

function Activity({ habit }: { habit: UserHabit }) {
	const { theme } = useTheme();
	const { categories } = useHabits();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { setCurrentHabit } = useContext(HabitsContext);

	const lighterColor = lightenColor(habit.color || theme.colors.text, 0.6);

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

	const habitCategory = categories.find((c) => c.category === habit.category);

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
				className="flex flex-col justify-between h-full"
			>
				<View
					style={{
						backgroundColor: lighterColor,
					}}
					className="h-14 rounded-t-xl"
				>
					<Text
						className="font-semibold w-1/2 italic ml-3 mt-2 text-[13px]"
						style={{
							color: theme.colors.text,
						}}
					>
						{habit.category.slice(0, 15) + (habit.category.length > 15 ? "..." : "")}
					</Text>
					<View
						className="px-2 py-1 rounded-bl-xl rounded-tr-xl"
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
				<View className="flex flex-col justify-evenly items-center rounded-b-xl bg-slate-20 flex-1">
					<CachedImage
						imagePath={imageUri || "images/categories/fitness.jpg"}
						style={StyleSheet.absoluteFill}
						borderBottomLeftRadius={10}
						borderBottomRightRadius={10}
						blurRadius={5}
					/>

					<View className=" flex items-center justify-center w-10/12 px-1 py-2 rounded-lg overflow-hidden">
						<BlurView intensity={60} tint={"light"} style={styles.blurView} />
						<Text
							className="text-md w-11/12 mx-auto font-semibold text-center py-2 mb-2 text-[14px]"
							style={{
								color: "#121212",
							}}
							numberOfLines={2}
							ellipsizeMode="tail"
						>
							{habit.name}
						</Text>
						<FontAwesome6
							name={habit.icon || "question"}
							size={32}
							color={habit.color || theme.colors.text}
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
