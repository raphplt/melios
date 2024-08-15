import React, { useContext } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Home from "../../components/Svg/Home";
import Progress from "../../components/Svg/Progress";
import Gift from "../../components/Svg/Gift";
import Agora from "../../components/Svg/Aroga";
import { ThemeContext } from "@context/ThemeContext";

const CustomTabBar = ({ state, descriptors, navigation }) => {
	const { theme } = useContext(ThemeContext);

	const IconComponent = React.memo(({ name, color }) => {
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
	});

	return (
		<View style={styles.tabBarContainer}>
			{state.routes.map((route, index) => {
				const isFocused = state.index === index;
				const iconColor = isFocused ? "#FFFFFF" : "#FF6347";
				const backgroundColor = isFocused ? "#FF6347" : "#FFFFFF";

				const onPress = () => {
					if (!isFocused) {
						navigation.navigate(route.name);
					}
				};

				return (
					<Pressable
						key={index}
						onPress={onPress}
						style={[styles.tabItem, { backgroundColor }]}
					>
						<IconComponent name={route.name} color={iconColor} />
					</Pressable>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	tabBarContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "rgb(8, 32, 159)",
		borderRadius: 30,
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginHorizontal: 20,
		marginBottom: 0,
		elevation: 2,
		position: "absolute",
		bottom: 20,
	},
	tabItem: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20,
		marginHorizontal: 5,
		height: 40,
	},
});

export default CustomTabBar;
