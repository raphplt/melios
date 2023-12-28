import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { useContext, useState } from "react";
import { DarkTheme, DefaultTheme } from "../../constants/Theme";
import { ThemeContext } from "../../components/ThemContext";

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
					title: "Accueil",

					headerShown: false,

					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="progression"
				options={{
					title: "Progression",
					tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="recompenses"
				options={{
					title: "Récompenses",
					tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="account"
				options={{
					title: "Compte",
					tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
				}}
			/>
		</Tabs>
	);
}
