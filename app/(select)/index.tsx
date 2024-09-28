import React from "react";
import { View, Text, StatusBar, FlatList } from "react-native";
import CategoriesList from "@components/Select/Containers/CategoriesList";
import HabitsType from "@components/Select/Containers/HabitsType";
import ButtonClose from "@components/Shared/ButtonClose";
import { SelectProvider } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";

export default function Select() {
	const { theme } = useTheme();

	return (
		<FlatList
			data={[]}
			ListHeaderComponent={
				<View
					style={{
						backgroundColor: theme.colors.background,
						paddingTop: StatusBar.currentHeight,
					}}
				>
					<ButtonClose />
					<HabitsType />
					<Text
						style={{
							color: theme.colors.textTertiary,
							textAlign: "center",
							marginVertical: 20,
						}}
					>
						OU CHOISISSEZ UNE HABITUDE EXISTANTE
					</Text>
				</View>
			}
			ListFooterComponent={<CategoriesList />}
			keyExtractor={() => "dummy"}
			renderItem={null}
			showsVerticalScrollIndicator={false}
		/>
	);
}
