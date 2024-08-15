import React, { useContext } from "react";
import { View, Pressable } from "react-native";
import Home from "../../components/Svg/Home";
import Progress from "../../components/Svg/Progress";
import Gift from "../../components/Svg/Gift";
import Agora from "../../components/Svg/Aroga";
import { ThemeContext } from "@context/ThemeContext";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import BlurGradientBackground from "./BlurGradientBackground";

interface CustomTabBarProps extends BottomTabBarProps {}

const CustomTabBar: React.FC<CustomTabBarProps> = ({
	state,
	descriptors,
	navigation,
}) => {
	const { theme } = useContext(ThemeContext);

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
					return <Agora color={color} />;
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
					backgroundColor: theme.colors.primary,
				}}
				className="w-[95%] mx-auto flex flex-row justify-between items-center rounded-[30px] py-3 px-4 mb-5"
			>
				{state.routes.map((route, index) => {
					const isFocused = state.index === index;
					const iconColor = isFocused ? theme.colors.primary : "gray";
					const backgroundColor = isFocused
						? theme.colors.blueSecondary
						: theme.colors.background;

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
							style={[{ backgroundColor }]}
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