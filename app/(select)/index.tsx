import React from "react";
import { FlatList, View } from "react-native";
import CategoriesList from "@components/Select/Containers/CategoriesList";
import HomeTop from "@components/Select/Containers/HomeTop";
import { useTheme } from "@context/ThemeContext";

export default function Select() {
	const { theme } = useTheme();
	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<FlatList
				data={[]}
				ListHeaderComponent={<HomeTop />}
				ListFooterComponent={<CategoriesList />}
				keyExtractor={() => "dummy"}
				renderItem={null}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}
