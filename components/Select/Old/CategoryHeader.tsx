import { FontAwesome6, AntDesign } from "@expo/vector-icons";
import { Pressable, View, Text, Animated } from "react-native";
import { Iconify } from "react-native-iconify";
import { useState, useEffect, useRef } from "react";

export default function CategoryHeader({
	item,
	displayedHabitsCount,
	setDisplayedHabitsCount,
	theme,
}: {
	item: any;
	displayedHabitsCount: any;
	setDisplayedHabitsCount: any;
	theme: any;
}) {
	const [isExpanded, setIsExpanded] = useState(
		displayedHabitsCount[item.category] === 5
	);
	const rotateAnim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(rotateAnim, {
			toValue: isExpanded ? 1 : 0,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [isExpanded]);

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	const handlePress = () => {
		setIsExpanded(!isExpanded);
		setDisplayedHabitsCount((prevState: any) => ({
			...prevState,
			[item.category]: prevState[item.category] > 0 ? 0 : 5,
		}));
	};

	return (
		<Pressable
			className="w-[95%] mx-auto flex flex-row items-center justify-between py-2 px-2 rounded-3xl mb-2 mt-4"
			style={{
				backgroundColor: theme.colors.background,
				borderColor: item.color,
				borderWidth: 1,
			}}
			onPress={handlePress}
		>
			<View className="flex flex-row items-center">
				<FontAwesome6
					name={item.icon}
					size={20}
					color={item.color}
					style={{ marginRight: 5, marginLeft: 5 }}
				/>
				<Text
					className="text-[16px] px-1"
					style={{
						color: item.color,
						fontFamily: "BaskervilleBold",
					}}
				>
					{item.category}
				</Text>
			</View>
			<Animated.View style={{ transform: [{ rotate }] }}>
				{displayedHabitsCount[item.category] === 5 ? (
					<Iconify icon="mingcute:up-line" size={20} color={item.color} />
				) : (
					<Iconify icon="mdi:chevron-down" size={20} color={item.color} />
				)}
			</Animated.View>
		</Pressable>
	);
}