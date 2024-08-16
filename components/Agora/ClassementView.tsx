import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import Filters from "./Filters";
import CardClassement from "./CardClassement";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Reward } from "../../types/reward";
import { useTabBarPadding } from "@hooks/useTabBar";

export default function ClassementView({
	sortedRewards,
	member,
	filter,
	setFilter,
}: {
	sortedRewards: any;
	member: any;
	filter: any;
	setFilter: any;
}) {
	const { theme } = useContext(ThemeContext);
	const paddingBottom = useTabBarPadding();

	return (
		<View className="w-full pb-10">
			<View className="mb-4 flex items-center justify-center flex-row gap-2">
				<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
				<Text
					className="text-xl text-center font-semibold"
					style={{ color: theme.colors.text }}
				>
					Classement général
				</Text>
			</View>

			<Filters filter={filter} setFilter={setFilter} theme={theme} />

			<View
				className="flex items-center justify-center flex-col"
				style={{
					paddingBottom: paddingBottom,
				}}
			>
				{sortedRewards.map((reward: Reward) => (
					<CardClassement
						key={reward.id}
						reward={reward}
						member={member}
						theme={theme}
					/>
				))}
			</View>
		</View>
	);
}
