import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
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
		{
			name: "Productivité",
			price: 300,
			color: "#BAFFC9",
			description: "Description 3",
			items: [
				{
					title: "Item 5",
					description: "Description 5",
				},
				{
					title: "Item 6",
					description: "Description 6",
				},
			],
		},
		{
			name: "Motivation",
			price: 400,
			color: "#BAE1FF",
			description: "Description 4",
			items: [
				{
					title: "Item 7",
					description: "Description 7",
				},
				{
					title: "Item 8",
					description: "Description 8",
				},
			],
		},
		{
			name: "Santé",
			price: 500,
			color: "#D0BAFF",
			description: "Description 5",
			items: [
				{
					title: "Item 9",
					description: "Description 9",
				},
				{
					title: "Item 10",
					description: "Description 10",
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
			<View className="w-11/12 mx-auto py-1">
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
			{/* <ScrollView showsVerticalScrollIndicator={false}>
				{packs.map((pack) => (
					<PackItem key={pack.name} pack={pack} />
				))}
			</ScrollView> */}
		</View>
	);
}