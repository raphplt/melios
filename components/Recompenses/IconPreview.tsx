import AnimatedPlaceholder from "@components/Shared/AnimatedPlaceholder";
import CachedImage from "@components/Shared/CachedImage";
import MoneyOdyssee from "@components/Svg/MoneyOdyssee";
import { useTheme } from "@context/ThemeContext";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

export default function IconPreview({
	cosmetic,
}: {
	cosmetic: ProfileCosmetic;
}) {
	const { theme } = useTheme();
	const [iconPath, setIconPath] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchIcon = async () => {
			setLoading(true);
			try {
				const path = getIcon(cosmetic.slug);
				setIconPath(path);
			} catch (error) {
				console.error("Failed to fetch icon:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchIcon();
	}, [cosmetic.slug]);

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

			<CachedImage
				imagePath={iconPath}
				className="w-24 h-24"
				placeholder={
					<AnimatedPlaceholder width={96} height={96} borderRadius={100} />
				}
			/>

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
