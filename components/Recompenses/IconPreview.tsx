import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { useContext } from "react";
import { View, Text, Image } from "react-native";

import { TouchableOpacity } from "react-native";
import { getMemberInfos, updateProfilePicture } from "@db/member";
import { Iconify } from "react-native-iconify";

export default function IconPreview({
	cosmetic,
}: {
	cosmetic: ProfileCosmetic;
}) {
	const { theme } = useContext(ThemeContext);
	const { points, setMember, member } = useData();

	return (
		<View
			className="flex flex-col items-center w-full mx-2 my-1 py-2 rounded-xl"
			key={cosmetic.id}
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.grayPrimary,
				borderWidth: 1,
				opacity: 1,
			}}
		>
			<Text
				numberOfLines={1}
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				ellipsizeMode="tail"
				className="w-11/12 text-center font-semibold mb-1"
			>
				{cosmetic.name}
			</Text>
			<Image source={getIcon(cosmetic.slug)} className="w-24 h-24" />

			<View className="flex flex-row items-center justify-center py-2">
				<Text
					className="mx-1 font-semibold "
					style={{
						color: theme.colors.primary,
					}}
				>
					{cosmetic.price}
				</Text>

				<MoneyOdyssee />
			</View>
		</View>
	);
}
