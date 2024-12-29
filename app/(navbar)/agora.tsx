import React from "react";
import { FlatList, View } from "react-native";
import AllLogs from "@components/Agora/AllLogs";
import MainSubSections from "@components/Agora/MainSubSections";

const data = [
	{ key: "MainSubSections", component: <MainSubSections /> },
	{ key: "AllLogs", component: <AllLogs /> },
];

export default function Agora() {
	return (
		<FlatList
			data={data}
			renderItem={({ item }) => <View>{item.component}</View>}
			keyExtractor={(item) => item.key}
			style={{ flex: 1 }}
			showsVerticalScrollIndicator={false}
		/>
	);
}
