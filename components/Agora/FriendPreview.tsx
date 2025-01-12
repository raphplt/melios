import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { getFriends } from "@db/member";
import { Member } from "@type/member";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { LinearGradient } from "expo-linear-gradient";
import ZoomableView from "@components/Shared/ZoomableView";
import { UserLevel } from "@type/levels";

const FriendPreview = () => {
	const [friends, setFriends] = useState<
		(Partial<Member> & Partial<UserLevel>)[]
	>([]);
	const { theme } = useTheme();
	const { t } = useTranslation();

	useEffect(() => {
		// Fetch friends
		const fetch = async () => {
			const friends = await getFriends();
			setFriends(friends);
		};
		fetch();
	}, []);

	const inviteFriends = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins-moi sur cette super application ! Télécharge-la ici : https://example.com/download",
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					console.log("Partagé via une activité spécifique");
				} else {
					console.log("Partage réussi");
				}
			} else if (result.action === Share.dismissedAction) {
				console.log("Partage annulé");
			}
		} catch (error) {
			console.error("Erreur lors du partage :", error);
		}
	};

	console.log(friends);

	return (
		<ScrollView
			showsHorizontalScrollIndicator={false}
			className="w-full ml-2 py-1"
			horizontal
		>
			<ZoomableView>
				<Pressable onPress={inviteFriends}>
					<LinearGradient
						colors={[theme.colors.backgroundTertiary, theme.colors.purpleSecondary]}
						style={{
							backgroundColor: theme.colors.cardBackground,
							borderColor: theme.colors.primary,
							borderWidth: 1,
							width: 110,
							height: 110,
							borderRadius: 10,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 10,
							marginHorizontal: 4,
						}}
					>
						<Iconify icon="mdi:account-plus" size={30} color={theme.colors.primary} />
						<Text
							style={{
								color: theme.colors.primary,
							}}
							className="text-[14px] font-semibold w-10/12 mx-auto text-center"
						>
							{t("invite_friends")}
						</Text>
					</LinearGradient>
				</Pressable>
			</ZoomableView>

			{friends.map((friend) => (
				<ZoomableView key={friend.uid}>
					<View
						className="flex flex-col items-center justify-center w-32 h-32 rounded-xl mx-1"
						style={{
							borderColor: theme.colors.primary,
							borderWidth: 1,
						}}
					>
						<CachedImage
							imagePath={"images/cosmetics/" + friend.profilePicture + ".png" || "/"}
							style={{
								width: 50,
								height: 50,
								borderRadius: 50,
							}}
						/>
						<Text
							style={{
								color: theme.colors.primary,
							}}
							className="mt-2 text-[14px] font-semibold"
						>
							{friend.nom}
						</Text>
						<Text>{/* {friend.levels[P0gwsxEYNJATbmCoOd\hc]} */}</Text>
					</View>
				</ZoomableView>
			))}
		</ScrollView>
	);
};

export default FriendPreview;
