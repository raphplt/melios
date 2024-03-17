import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import Melios from "../../components/Svg/Melios";
import { getRewards } from "../../db/rewards";
import Points from "../../components/Points";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const { theme } = useContext(ThemeContext);

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					headerTitleStyle: {
						display: "none",
					},
					headerStyle: {
						backgroundColor: theme.colors.backgroundSecondary,
						borderBottomLeftRadius: 10,
						borderBottomRightRadius: 10,
					},
					headerLeft: () => (
						<View
							style={{
								marginLeft: 15,
							}}
						>
							<Melios />
						</View>
					),
					headerRight: () => <Points />,
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="progression"
				options={{
					title: "Progression",
					headerStyle: {
						backgroundColor: theme.colors.backgroundSecondary,
						borderBottomLeftRadius: 10,
						borderBottomRightRadius: 10,
					},

					tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="recompenses"
				options={{
					title: "Récompenses",
					headerStyle: {
						backgroundColor: theme.colors.backgroundSecondary,
						borderBottomLeftRadius: 10,
						borderBottomRightRadius: 10,
					},
					tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Compte",
					headerBackground(props) {
						return (
							<View
								style={{
									flex: 1,
									backgroundColor: theme.colors.backgroundSecondary,
								}}
								className="rounded-b-xl"
							/>
						);
					},
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
