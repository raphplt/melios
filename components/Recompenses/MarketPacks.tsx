import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { Iconify } from "react-native-iconify";
import PackItem from "./PackItem";
import { Pack } from "@type/pack";

export default function MarketPacks() {
	const { theme } = useContext(ThemeContext);

	const packs: Pack[] = [
		{
			name: "Sommeil profond",
			description: "Description 1",
			color: "#FFB3BA",
			price: 100,
			items: [
				{
					title: "Item 1",
					description: "Description 1",
				},
				{
					title: "Item 2",
					description: "Description 2",
				},
			],
		},
		{
			name: "Confiance en soi",
			price: 200,
			color: "#FFDFBA",
			description: "Description 2",
			items: [
				{
					title: "Item 3",
					description: "Description 3",
				},
				{
					title: "Item 4",
					description: "Description 4",
				},
			],
		},
	];

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
		>
			<View className=" w-11/12 mx-auto py-3">
				<View className="flex flex-row items-center">
					<Iconify icon="lucide:box" size={24} color={theme.colors.text} />
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-lg mx-2"
					>
						Packs
					</Text>
				</View>
			</View>
			<FlatList
				data={packs}
				className="w-[95%] mx-auto"
				keyExtractor={(item) => item.name}
				renderItem={({ item }) => <PackItem pack={item} />}
				showsVerticalScrollIndicator={false}
				numColumns={2}
			/>
		</View>
	);
}
