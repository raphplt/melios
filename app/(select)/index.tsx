import CategoriesList from "@components/Select/Containers/CategoriesList";
import HabitsType from "@components/Select/Containers/HabitsType";
import ButtonClose from "@components/Shared/ButtonClose";
import { useTheme } from "@context/ThemeContext";

import { View, Text, StatusBar, FlatList } from "react-native";

export default function Select() {
	const { theme } = useTheme();

	return (
		<>
			<FlatList
				data={[]}
				ListHeaderComponent={
					<View
						className="h-fit flex-1"
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
							}}
							className="text-center my-5"
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
		</>
	);
}
