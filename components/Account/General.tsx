import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View } from "react-native";
import AccountBlock from "./AccountBlock";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";
import RowBlock from "./RowBlock";

export default function General() {
	const { theme } = useContext(ThemeContext);
	const { habits } = useData();

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
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>
			<RowBlock
				icon={<Iconify icon="ph:target" size={24} color={theme.colors.text} />}
				title="Mes objectifs"
			/>
		</AccountBlock>
	);
}
