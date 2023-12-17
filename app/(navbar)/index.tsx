import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import TopStats from "../../components/TopStats";
import { ThemeProvider } from "@react-navigation/native";
import CardHabit from "../../components/CardHabit";
import { Button, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { db } from "../../db";
import fetchData from "../../db/test";
import { useNavigation } from "expo-router";

export default function Index() {
	const { theme } = useContext(ThemeContext);

	const navigation: any = useNavigation();

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
			</ScrollView>
		</ThemeProvider>
	);
}
