import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";
import Filters from "./Filters";
import CardClassement from "./CardClassement";
import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import { Reward } from "../../type/reward";
import { useTabBarPadding } from "@hooks/useTabBar";
import { useData } from "@context/DataContext";

export default function ClassementView({
	sortedRewards,
	filter,
	setFilter,
}: {
	sortedRewards: Reward[];
	filter: any;
	setFilter: any;
}) {
	const { theme } = useContext(ThemeContext);
	const paddingBottom = useTabBarPadding();
	const [displayedItemCount, setDisplayedItemCount] = useState(10);

	const { member } = useData();

	// Vérification de la validité de member et de la propriété uid
	const userPosition =
		member && member.uid
			? sortedRewards.findIndex((reward: Reward) => reward.uid === member.uid)
			: -1;

	// Si member est indéfini ou uid est manquant, on ne cherche pas à afficher l'utilisateur
	const isUserVisible = userPosition >= 0 && userPosition < displayedItemCount;

	return (
		<View className="w-full pb-10">
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

				{/* Si l'utilisateur n'est pas visible dans la liste affichée mais a une position */}
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
