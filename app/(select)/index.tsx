import React from "react";
import { FlatList } from "react-native";
import CategoriesList from "@components/Select/Containers/CategoriesList";
import HomeTop from "@components/Select/Containers/HomeTop";

export default function Select() {
	return (
		<FlatList
			data={[]}
			ListHeaderComponent={<HomeTop />}
			ListFooterComponent={<CategoriesList />}
			keyExtractor={() => "dummy"}
			renderItem={null}
			showsVerticalScrollIndicator={false}
		/>
	);
}
