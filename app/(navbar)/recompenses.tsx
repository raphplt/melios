import { FlatList } from "react-native";
import { useTheme } from "@context/ThemeContext";
import MarketPacks from "@components/Recompenses/MarketPacks";
import CosmeticPreview from "@components/Recompenses/CosmeticPreview";
import ModalTutorial from "@components/Modals/ModalTutoriel";
import React from "react";

export default function Recompenses() {
	const { theme } = useTheme();

	const components = [
		{ key: "cosmeticPreview", component: <CosmeticPreview /> },
		{ key: "marketPacks", component: <MarketPacks /> },
	];

	return (
		<>
			<FlatList
				data={components}
				renderItem={({ item }) => item.component}
				keyExtractor={(item) => item.key}
				style={{
					backgroundColor: theme.colors.background,
				}}
				showsVerticalScrollIndicator={false}
			/>
			<ModalTutorial
				title="Comment utiliser la page Récompenses"
				paragraphs={[
					"1. Visitez la boutique de cosmétiques pour personnaliser votre avatar ou photo de profil en dépensant vos points Melios.",
					"2. Accédez aux packs de récompenses, qui contiennent des tutoriels pratiques sur des thèmes tels que le sommeil, la productivité, la confiance en soi, la motivation et la santé.",
					"3. Utilisez vos points Melios pour débloquer des contenus exclusifs et améliorer vos compétences.",
				]}
				imagePath="images/illustrations/character4.png"
				slug="rewards"
			/>
		</>
	);
}
