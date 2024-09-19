import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View } from "react-native";
import AccountBlock from "./AccountBlock";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";
import RowBlock from "./RowBlock";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function General() {
	const { theme } = useContext(ThemeContext);
	const { habits } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<AccountBlock title="Général">
			<RowBlock
				icon={
					<Iconify
						icon="icon-park-outline:list-add"
						size={24}
						color={theme.colors.text}
					/>
				}
				title="Mes habitudes"
				count={habits.length}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={() => navigation.navigate("editHabits")}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>
			<RowBlock
				icon={<Iconify icon="ph:target" size={24} color={theme.colors.text} />}
				title="Mes objectifs"
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={() => navigation.navigate("editGoals")}
			/>
		</AccountBlock>
	);
}
