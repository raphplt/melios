import { View } from "react-native";
import StatCard from "./StatCard";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import useIndex from "@hooks/useIndex";

export default function Stats() {
	const { theme } = useContext(ThemeContext);
	const { completedHabitsData } = useIndex();

	return (
		<View
			className="flex flex-row justify-center w-full py-10 rounded-b-3xl"
			style={{
				backgroundColor: theme.colors.backgroundTertiary,
			}}
		>
			<StatCard
				title="Complétées aujourd'hui"
				value={String(completedHabitsData.length)}
				color="red"
			/>
			<StatCard title="Habits" value="12" color="red" icon={<MoneyOdyssee />} />
		</View>
	);
}
