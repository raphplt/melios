import React from "react";
import { FlatList, View } from "react-native";
import AllLogs from "@components/Agora/AllLogs";
import MainSubSections from "@components/Agora/MainSubSections";
import ModalTutorial from "@components/Modals/ModalTutoriel";
import { useTheme } from "@context/ThemeContext";

const data = [
	{ key: "MainSubSections", component: <MainSubSections /> },
	{ key: "AllLogs", component: <AllLogs /> },
];

export default function Agora() {
	const { theme } = useTheme();
	return (
		<>
			<FlatList
				data={data}
				renderItem={({ item }) => <View>{item.component}</View>}
				keyExtractor={(item) => item.key}
				style={{ flex: 1, backgroundColor: theme.colors.background }}
				showsVerticalScrollIndicator={false}
			/>
			<ModalTutorial
				title="Comment utiliser la page Agora"
				paragraphs={[
					"1. Consultez le classement pour voir votre position par rapport aux autres utilisateurs et vous motiver à progresser.",
					"2. Ajoutez des amis pour échanger, vous soutenir et suivre mutuellement vos progrès.",
					"3. Parcourez l'activité des utilisateurs pour voir leurs habitudes complétées et leurs séries. Inspirez-vous des réussites de la communauté.",
				]}
				imagePath="images/illustrations/character1.png"
				slug="agora"
			/>
		</>
	);
}
