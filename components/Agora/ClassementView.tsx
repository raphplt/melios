import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import Filters from "./Filters";
import CardClassement from "./CardClassement";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { Reward } from "../../type/reward";
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
	const [displayedItemCount, setDisplayedItemCount] = useState(10);

	const userPosition = sortedRewards.findIndex(
		(reward: Reward) => reward.uid === member.uid
	);

	const isUserVisible = userPosition >= 0 && userPosition < displayedItemCount;

	return (
		<View className="w-full pb-10">
			<View className="mb-4 flex items-center justify-center flex-row gap-2">
				<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
				<Text
					className="text-xl text-center font-semibold"
					style={{
						color: theme.colors.text,
						fontFamily: "Baskerville",
					}}
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
				{sortedRewards
					.slice(0, displayedItemCount)
					.map((reward: Reward, index: number) => (
						<CardClassement
							key={reward.id}
							rank={index + 1}
							reward={reward}
							member={member}
							theme={theme}
							filter={filter}
						/>
					))}

				{!isUserVisible && userPosition >= 0 && (
					<>
						<View className="mt-4 mb-2">
							<Text
								className="text-center text-sm"
								style={{
									color: theme.colors.text,
									fontStyle: "italic",
								}}
							>
								Vous êtes classé ici :
							</Text>
						</View>
						<CardClassement
							key={sortedRewards[userPosition].id}
							rank={userPosition + 1}
							reward={sortedRewards[userPosition]}
							member={member}
							theme={theme}
							filter={filter}
						/>
					</>
				)}
			</View>
		</View>
	);
}
