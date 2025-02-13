import React, { useContext, useState } from "react";
import { View, Pressable, Animated } from "react-native";
import Home from "../../components/Svg/Home";
import Progress from "../../components/Svg/Progress";
import Gift from "../../components/Svg/Gift";
import Agora from "../../components/Svg/Aroga";
import { ThemeContext } from "@context/ThemeContext";
import BlurGradientBackground from "./BlurGradientBackground";
import { Iconify } from "react-native-iconify";

type Props = {
	state: any;
	descriptors: any;
	navigation: any;
};

const CustomTabBar = ({ state, descriptors, navigation }: Props) => {
	const { theme } = useContext(ThemeContext);
	const [pressedIndex, setPressedIndex] = useState<number | null>(null);

	const IconComponent = React.memo(
		({ name, color }: { name: string; color: string }) => {
			switch (name) {
				case "index":
					return <Home color={color} />;
				case "progression":
					return <Progress color={color} />;
				case "recompenses":
					return <Gift color={color} />;
				case "agora":
					return <Iconify icon="formkit:people" size={30} color={color} />;
				default:
					return null;
			}
		}
	);

	return (
		<View
			className="bottom-0 w-full"
			style={{
				position: "absolute",
				elevation: 0,
			}}
		>
			<BlurGradientBackground />
			<View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="w-[95%] mx-auto flex flex-row justify-between items-center rounded-[30px] py-3 px-4 mb-5 mt-4"
			>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index;
					const isPressed = pressedIndex === index;
					const iconColor =
						isFocused || isPressed ? theme.colors.primary : theme.colors.tertiary;
					const backgroundColor =
						isFocused || isPressed ? theme.colors.backgroundTertiary : "transparent";

					const onPress = () => {
						if (!isFocused) {
							navigation.navigate(route.name);
						}
					};

					return (
						<Pressable
							key={index}
							onPress={onPress}
							className="flex flex-1 items-center rounded-3xl mx-2 h-10 justify-center"
							style={[
								{
									backgroundColor,
									transform: [{ scale: isPressed ? 0.95 : 1.0 }],
								},
							]}
							onPressIn={() => {
								setPressedIndex(index);
							}}
							onPressOut={() => {
								setPressedIndex(null);
							}}
						>
							<IconComponent name={route.name} color={iconColor} />
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

export default CustomTabBar;
