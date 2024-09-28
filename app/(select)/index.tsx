import React from "react";
import { View, Text, StatusBar, FlatList } from "react-native";
import CategoriesList from "@components/Select/Containers/CategoriesList";
import HabitsType from "@components/Select/Containers/HabitsType";
import ButtonClose from "@components/Shared/ButtonClose";
import { SelectProvider } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

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
					<View className="flex flex-row items-center my-2">
						<View
							className="w-1/3 mx-auto my-4"
							style={{
								backgroundColor: theme.colors.grayPrimary,
								height: 1,
							}}
						/>
						<View
							className=" rounded-full w-16 h-16 flex items-center justify-center mx-2"
							style={{
								backgroundColor: theme.colors.backgroundTertiary,
								borderColor: theme.colors.cardBackground,
								borderWidth: 2,
							}}
						>
							<Iconify
								size={24}
								icon="ic:baseline-plus"
								color={theme.colors.primary}
							/>
						</View>
						<View
							className="w-1/3 mx-auto my-4"
							style={{
								backgroundColor: theme.colors.grayPrimary,
								height: 1,
							}}
						/>
					</View>
				</View>
			}
			ListFooterComponent={<CategoriesList />}
			keyExtractor={() => "dummy"}
			renderItem={null}
			showsVerticalScrollIndicator={false}
		/>
	);
}
