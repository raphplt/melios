import React, { useState, useEffect } from "react";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
} from "react-native-reanimated";
import { getMemberInfos, updateProfilePicture } from "@db/member";
import { Iconify } from "react-native-iconify";
import CachedImage from "@components/Shared/CachedImage";

export default function ProfilIcon({
	cosmetic,
}: {
	cosmetic: ProfileCosmetic;
}) {
	const { theme } = useTheme();
	const { points, setMember, member } = useData();

	const isGrayedOut = cosmetic.price > points.odyssee;
	const selected = member?.profilePicture === cosmetic.slug;

	// State to store the resolved image path
	const [iconPath, setIconPath] = useState<string>("");

	useEffect(() => {
		const fetchIcon = async () => {
			try {
				const path = getIcon(cosmetic.slug);
				setIconPath(path);
			} catch (error) {
				console.error("Failed to fetch icon:", error);
			}
		};

		fetchIcon();
	}, [cosmetic.slug]);

	// Shared values for animations
	const scale = useSharedValue(1);
	const fogTranslation = useSharedValue(0);

	// Glow animation style (for selected avatars)
	const glowStyle = useAnimatedStyle(() => ({
		shadowOpacity: withTiming(selected ? 0.8 : 0),
		shadowRadius: withTiming(selected ? 10 : 0),
		shadowColor: theme.colors.primary,
		style: { shadowOffset: { width: 0, height: 0 } },
		transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
	}));

	useEffect(() => {
		if (isGrayedOut) {
			fogTranslation.value = 10;
		}
	}, [isGrayedOut]);

	const handlePress = async () => {
		if (!isGrayedOut) {
			scale.value = 0.9;
			setTimeout(() => (scale.value = 1), 150);
			await updateProfilePicture(cosmetic.slug);
			const updatedMember = await getMemberInfos({ forceRefresh: true });
			setMember(updatedMember);
		}
	};

	return (
		<TouchableOpacity
			onPress={handlePress}
			disabled={isGrayedOut}
			className="flex flex-col items-center w-[31%] mx-auto my-1 py-2 rounded-xl"
		>
			<Animated.View
				style={[
					{
						backgroundColor: isGrayedOut
							? theme.colors.grayPrimary
							: selected
							? theme.colors.backgroundTertiary
							: theme.colors.cardBackground,
						borderColor: selected ? theme.colors.primary : theme.colors.grayPrimary,
						borderWidth: 1,
						borderRadius: 12,
						opacity: isGrayedOut ? 0.5 : 1,
					},
					glowStyle,
				]}
				className="items-center justify-center p-3"
			>
				{/* Name */}
				<Text
					numberOfLines={1}
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					ellipsizeMode="tail"
					className="text-center font-semibold mb-1"
				>
					{cosmetic.name}
				</Text>

				{/* Icon */}
				{<CachedImage imagePath={iconPath} className="w-24 h-24" />}
				{/* Price & Icons */}
				<View className="flex flex-row items-center justify-center py-2">
					<Text
						className="mx-1 font-semibold"
						style={{
							color: isGrayedOut
								? theme.colors.text
								: selected
								? theme.colors.primary
								: theme.colors.yellowPrimary,
						}}
					>
						{cosmetic.price}
					</Text>
					{isGrayedOut ? (
						<Iconify
							icon="ic:baseline-lock"
							size={20}
							color={theme.colors.textTertiary}
						/>
					) : selected ? (
						<Iconify icon="mdi:check-circle" size={20} color={theme.colors.primary} />
					) : (
						<Iconify
							icon="material-symbols:trophy"
							size={20}
							color={theme.colors.yellowPrimary}
						/>
					)}
				</View>
			</Animated.View>
		</TouchableOpacity>
	);
}
