import { Tabs, useNavigation } from "expo-router";
import { Pressable, View } from "react-native";
import { useContext, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import LoaderScreen from "@components/Shared/LoaderScreen";
import CustomTabBar from "@components/Shared/CustomTabBar";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSession } from "@context/UserContext";
import { ThemeContext } from "@context/ThemeContext";
import Melios from "@components/Svg/Melios";
import Points from "@components/Shared/Points";

const createHeaderStyle = (backgroundColor: string) => ({
	backgroundColor,

	shadowColor: "transparent",
});

const createTabOptions = (
	title: string,
	headerLeft?: () => JSX.Element,
	headerRight?: () => JSX.Element,
	headerTitleStyleOverride?: object,
	headerBackgroundColor: string = "transparent"
) => ({
	title,
	headerTitleStyle: headerTitleStyleOverride || {},
	headerStyle: createHeaderStyle(headerBackgroundColor),
	headerLeft,
	headerRight,
});

const TabLayout: React.FC = () => {
	const { user, isLoading } = useSession();
	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		if (!isLoading && !user) {
			navigation.navigate("login");
		}
	}, [isLoading, user, navigation]);

	if (isLoading) return <LoaderScreen text="Chargement..." />;

	return (
		<>
			<Tabs tabBar={(props) => <CustomTabBar {...props} />}>
				<Tabs.Screen
					name="index"
					options={createTabOptions(
						"Accueil",
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
					)}
				/>
				<Tabs.Screen
					name="progression"
					options={createTabOptions(
						"Progression",
						undefined,
						undefined,
						undefined,
						theme.colors.backgroundTertiary
					)}
				/>
				<Tabs.Screen name="recompenses" options={createTabOptions("Récompenses")} />
				<Tabs.Screen name="agora" options={createTabOptions("Agora")} />
			</Tabs>
		</>
	);
};

export default TabLayout;