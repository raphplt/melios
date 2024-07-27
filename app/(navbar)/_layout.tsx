import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Melios from "../../components/Svg/Melios";
import { AntDesign } from "@expo/vector-icons";
import { useSession } from "../../context/UserContext";
import Points from "../../components/Recompenses/Points";
import Home from "../../components/Svg/Home";
import Progress from "../../components/Svg/Progress";
import Gift from "../../components/Svg/Gift";
import User from "../../components/Svg/User";
import Agora from "../../components/Svg/Aroga";

const createHeaderStyle = (theme: any) => ({
	backgroundColor: theme.colors.background,
	borderBottomLeftRadius: 10,
	borderBottomRightRadius: 10,
	shadowColor: "transparent",
});

const createTabOptions = (
	theme: any,
	title: string,
	tabBarIcon?: (color: any) => JSX.Element,
	headerLeft?: () => JSX.Element,
	headerRight?: () => JSX.Element,
	headerTitleStyleOverride?: object
) => ({
	title,
	headerTitleStyle: headerTitleStyleOverride || {},
	tabBarShowLabel: false,
	headerStyle: createHeaderStyle(theme),
	tabBarStyle: {
		backgroundColor: theme.colors.background,
		shadowOpacity: 0,
		elevation: 0,
		borderTopWidth: 0,
	},
	headerLeft,
	headerRight,
	tabBarIcon,
});

const TabLayout: React.FC = () => {
	const { user, isLoading } = useSession();
	const { theme } = useContext(ThemeContext);
	const navigation: any = useNavigation();

	useEffect(() => {
		if (!isLoading && !user) {
			navigation.navigate("login");
		}
	}, [isLoading, user, navigation]);

	if (isLoading) {
		return (
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "center",
					height: "100%",
				}}
			>
				<Text style={{ fontSize: 20, fontWeight: "bold", color: "gray" }}>
					Loading...
				</Text>
			</View>
		);
	}

	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={
					createTabOptions(
						theme,
						"Accueil",
						({ color }) => <Home color={color} />,
						() => (
							<View style={{ marginLeft: 15 }}>
								<Melios fill={theme.colors.text} />
							</View>
						),
						() => (
							<View style={{ flexDirection: "row", alignItems: "center" }}>
								<Points />
								<Pressable
									onPress={() => navigation.navigate("account")}
									className="ml-3"
								>
									<AntDesign
										name="user"
										size={24}
										color={theme.colors.text}
										style={{ marginRight: 20 }}
									/>
								</Pressable>
							</View>
						),
						{ display: "none" }
					) as any
				}
			/>
			<Tabs.Screen
				name="progression"
				options={
					createTabOptions(theme, "Progression", ({ color }) => (
						<Progress color={color} />
					)) as any
				}
			/>
			<Tabs.Screen
				name="recompenses"
				options={
					createTabOptions(theme, "Récompenses", ({ color }) => (
						<Gift color={color} />
					)) as any
				}
			/>
			<Tabs.Screen
				name="agora"
				options={
					createTabOptions(theme, "Agora", ({ color }) => (
						<Agora color={color} />
					)) as any
				}
			/>
		</Tabs>
	);
};

export default TabLayout;
