import { Text, View } from "react-native";
import HabitTypeItem from "../Items/HabitTypeItem";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { customMessage } from "@utils/select/customMessage";

export default function HabitsType() {
	const { theme } = useTheme();
	const { type, setType } = useSelect();

	return (
		<>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-2xl mt-1 w-11/12 mx-auto"
			>
				Créer une habitude
			</Text>
			<View className="flex flex-row items-center justify-between w-11/12 mx-auto pt-4">
				<HabitTypeItem
					icon={<Iconify size={24} icon="ph:sun" color={theme.colors.text} />}
					name="Positif"
					bgColor={theme.colors.greenSecondary}
					bgColorSelected={theme.colors.greenPrimary}
					onPress={() => setType("Positif")}
					typeHabit="Positif"
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="material-symbols:block"
							color={theme.colors.text}
						/>
					}
					name="Négatif"
					bgColor={theme.colors.redSecondary}
					bgColorSelected={theme.colors.redPrimary}
					onPress={() => setType("Négatif")}
					typeHabit="Négatif"
				/>
				<HabitTypeItem
					icon={
						<Iconify
							size={24}
							icon="material-symbols:add"
							color={theme.colors.text}
						/>
					}
					name="Créer"
					bgColor={theme.colors.blueSecondary}
					bgColorSelected={theme.colors.bluePrimary}
					onPress={() => setType("Personnalisé")}
					typeHabit="Personnalisé"
				/>
			</View>
			<View
				className="w-11/12 mx-auto mt-4 px-4 py-2 rounded-xl flex flex-col"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-lg font-semibold"
				>
					{type}
				</Text>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-[16px] mt-1"
				>
					{customMessage(type)}
				</Text>
			</View>
		</>
	);
}
