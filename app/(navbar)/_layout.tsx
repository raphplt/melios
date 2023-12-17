import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Accueil",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
					// headerRight: () => (
					// 	<Link href="/modal" asChild>
					// 		<Pressable>
					// 			{({ pressed }) => (
					// 				<FontAwesome
					// 					name="info-circle"
					// 					size={25}
					// 					color={Colors[colorScheme ?? "light"].text}
					// 					style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
					// 				/>
					// 			)}
					// 		</Pressable>
					// 	</Link>
					// ),
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
