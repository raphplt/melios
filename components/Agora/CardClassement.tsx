import { Text, View } from "react-native";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import getIcon from "@utils/cosmeticsUtils";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useState, useEffect } from "react";
import CachedImage from "@components/Shared/CachedImage";

export default function CardClassement({
	rank,
	reward,
}: {
	rank: number;
	reward: any;
}) {
	const { theme } = useTheme();
	const { member } = useData();
	if (!member) return null;

	const backgroundColor = (rank: number) => {
		switch (rank) {
			case 1:
				return "#FFDD57";
			case 2:
				return "#D3D3D3";
			case 3:
				return "#D2A679";
			default:
				return theme.colors.cardBackground;
		}
	};

	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		const loadProfilePicture = () => {
			if (member?.profilePicture) {
				const uri = getIcon(reward.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [member]);

	return (
		<View
			key={reward.id}
			style={{
				backgroundColor: backgroundColor(rank),
				borderWidth: 2,
				borderColor:
					member.uid === reward.uid ? theme.colors.primary : backgroundColor(rank),
			}}
			className="flex flex-row justify-between items-center w-[95%] rounded-xl px-2 py-2 my-1 mx-auto"
		>
			<View className="flex items-center flex-row justify-center gap-1">
				<Text
					style={{ color: theme.colors.text, fontWeight: "bold" }}
					className="w-8"
				>
					#{rank}
				</Text>

				<CachedImage
					imagePath={profilePictureUri || "images/cosmetics/man.png"}
					style={{ width: 32, height: 32, marginRight: 8 }}
				/>
				<Text style={{ color: theme.colors.text }}>{reward.name}</Text>
			</View>
			<View className="flex flex-row items-center justify-center px-3 rounded-xl py-1 w-fit">
				<View className="flex items-center flex-row w-fit">
					<MoneyOdyssee />
					<Text
						className="ml-2 w-12 font-semibold"
						style={{ color: theme.colors.text }}
					>
						{reward.odyssee}
					</Text>
				</View>
			</View>
		</View>
	);
}
