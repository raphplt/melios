import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemContext";
import Melios from "../../components/Svg/Melios";
import { AntDesign } from "@expo/vector-icons";
import { useSession } from "../../constants/UserContext";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const { user, isLoading }: any = useSession();
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	console.log("user", user);

	useEffect(() => {
		if (!isLoading && !user) {
			navigation.navigate("login");
		}
	}, [isLoading, user]);

	if (isLoading) {
		return (
			<View className="flex-1 items-center justify-center h-screen">
				<Text className="text-2xl font-bold text-center text-gray-700">
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Accueil",
					headerTitleStyle: {
						display: "none",
					},
					headerStyle: {
						backgroundColor: theme.colors.background,
						borderBottomLeftRadius: 10,
						borderBottomRightRadius: 10,
					},
					headerLeft: () => (
						<View
							style={{
								marginLeft: 15,
							}}
						>
							<Melios fill={theme.colors.text} />
						</View>
					),
					headerRight: () => (
						<Pressable
							onPress={() => {
								navigation.navigate("account");
							}}
						>
							<AntDesign
								name="user"
								size={24}
								color="black"
								style={{ marginRight: 15 }}
							/>
						</Pressable>
					),

					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="progression"
				options={{
					title: "Progression",
					headerStyle: {
						backgroundColor: theme.colors.background,
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
						backgroundColor: theme.colors.background,
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
									backgroundColor: theme.colors.background,
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
