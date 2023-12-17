import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import TopStats from "../../components/TopStats";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../../components/CardHabit";
import { Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../../db";

export default function TabOneScreen() {
	const { theme } = useContext(ThemeContext);

	const [users, setUsers] = useState([]); // Ajoutez un état pour stocker les utilisateurs

	const fetch = async () => {
		try {
			const snapshot = await fetchData();
			setUsers(users); // Mettez à jour l'état avec les utilisateurs récupérés
		} catch (error) {
			console.error("Erreur lors de la récupération des données : ", error);
		}
	};

	useEffect(() => {
		fetch(); // Appelez fetchData lorsque le composant est monté
	}, []);

	return (
		<ThemeProvider value={theme}>
			<ScrollView>
				<View style={{ backgroundColor: theme.colors.background }}>
					<TopStats />
				</View>
				<View
					className="flex flex-col mt-6"
					style={{ backgroundColor: theme.colors.background }}
				>
					<CardHabit
						habit={{
							title: "Boire un verre d'eau",
							image: require("../../assets/images/icons/water.png"),
						}}
						navigation={"navigation"}
					/>

					<CardHabit
						habit={{
							title: "Boire un verre d'eau",
							image: require("../../assets/images/icons/water.png"),
						}}
						navigation={"navigation"}
					/>
				</View>
				<View />
				<View style={{ backgroundColor: theme.colors.background }}>
					{users.map(
						(
							user: any // Affichez chaque utilisateur
						) => (
							<Text key={user.id}>{user.email}</Text> // Remplacez "name" par le champ que vous voulez afficher
						)
					)}
				</View>
			</ScrollView>
		</ThemeProvider>
	);
}
