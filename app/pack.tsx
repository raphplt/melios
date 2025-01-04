import { useData } from "@context/DataContext";
import React from "react";
import { Text, View } from "react-native";

const Pack = () => {
	const { selectedPack } = useData();
	return (
		<View>
			<Text>{selectedPack?.name}</Text>
			<Text>{selectedPack?.image}</Text>
		</View>
	);
};

export default Pack;
