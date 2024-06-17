import { FontAwesome } from "@expo/vector-icons";
import { Tabs, useNavigation } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../components/ThemeContext";
import Melios from "../../components/Svg/Melios";
import { AntDesign } from "@expo/vector-icons";
import { useSession } from "../../constants/UserContext";
import Points from "../../components/Points";

interface TabBarIconProps {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, color }) => (
	<FontAwesome name={name} size={28} color={color} />
);

const createHeaderStyle = (theme: any) => ({
	backgroundColor: theme.colors.background,
	borderBottomLeftRadius: 10,
	borderBottomRightRadius: 10,
	shadowColor: "transparent",
});

const createTabOptions = (
	theme: any,
	title: string,
	iconName: string,
	headerLeft?: () => JSX.Element,
	headerRight?: () => JSX.Element,
	headerTitleStyleOverride?: object // Ajout d'un paramètre pour le style de titre d'en-tête personnalisé
) => ({
	title,
	headerTitleStyle: headerTitleStyleOverride || {}, // Utilisation du style personnalisé s'il est fourni
	tabBarShowLabel: false,
	headerStyle: createHeaderStyle(theme),
	tabBarStyle: {
		backgroundColor: theme.colors.background,
		shadowOpacity: 0, // Supprimer l'ombre pour iOS
		elevation: 0, // Supprimer l'ombre pour Android
		borderTopWidth: 0, // Optionnel: supprimer la bordure en haut pour un look plus net
	},

	headerLeft,
	headerRight,
	tabBarIcon: ({ color }: { color: string }) => (
		<TabBarIcon name={iconName as any} color={color} />
	),
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
						"home",
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
									className="ml-2"
								>
									<AntDesign
										name="user"
										size={24}
										color="black"
										style={{ marginRight: 15 }}
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
				options={createTabOptions(theme, "Progression", "bar-chart") as any}
			/>
			<Tabs.Screen
				name="recompenses"
				options={createTabOptions(theme, "Récompenses", "trophy") as any}
			/>
			<Tabs.Screen
				name="account"
				options={createTabOptions(theme, "Compte", "user") as any}
			/>
		</Tabs>
	);
};

export default TabLayout;
