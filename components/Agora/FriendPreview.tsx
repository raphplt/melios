import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { getFriends } from "@db/member";
import { Member } from "@type/member";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Pressable,
	ScrollView,
	Share,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Iconify } from "react-native-iconify";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import ZoomableView from "@components/Shared/ZoomableView";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import FriendModal from "@components/Modals/FriendModal";
import AnimatedPlaceholder from "@components/Shared/AnimatedPlaceholder";

const FriendPreview = () => {
	const [friends, setFriends] = useState<
		(Partial<Member> & { currentLevel?: string })[]
	>([]);
	const { theme } = useTheme();
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const [visible, setVisible] = useState(false);
	const [selectedFriend, setSelectedFriend] = useState<Partial<Member> | null>(
		null
	);

	useEffect(() => {
		try {
			const fetch = async () => {
				const friends = await getFriends();
				setFriends(friends);
			};
			fetch();
		} catch (error) {
			console.error("Erreur lors de la récupération des amis :", error);
		} finally {
			setLoading(false);
		}
	}, []);

	const inviteFriends = async () => {
		try {
			const result = await Share.share({
				message:
					"Rejoins-moi sur Melios ! Télécharge l'application ici : https://linktr.ee/Melios_app",
			});
			if (result.action === Share.sharedAction) {
				console.log("Partage réussi");
			} else if (result.action === Share.dismissedAction) {
				console.log("Partage annulé");
			}
		} catch (error) {
			console.error("Erreur lors du partage :", error);
		}
	};

	const Placeholder = () => (
		<ShimmerPlaceholder
			width={80}
			height={80}
			style={{
				borderRadius: 40,
				marginRight: 12,
			}}
		/>
	);

	return (
		<>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				horizontal
				contentContainerStyle={{ paddingHorizontal: 8, alignItems: "flex-start" }}
				className="py-1 ml-2 w-full"
			>
				{loading ? (
					<Placeholder />
				) : friends.length > 1 ? (
					friends.map((friend, index) => (
						<View key={index} style={{ alignItems: "center", marginRight: 12 }}>
							<ZoomableView>
								<TouchableOpacity
									onPress={() => {
										setSelectedFriend(friend);
										setVisible(true);
									}}
								>
									<LinearGradient
										colors={["#ff9a9e", "#fad0c4"]}
										style={{
											width: 80,
											height: 80,
											borderRadius: 40,
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<CachedImage
											imagePath={`images/cosmetics/${friend.profilePicture ?? "man"}.png`}
											style={{
												width: 70,
												height: 70,
												borderRadius: 35,
												borderWidth: 2,
												borderColor: "white",
											}}
											placeholder={
												<View
													style={{
														width: 70,
														height: 70,
														borderRadius: 35,
														backgroundColor: "rgba(255, 255, 255, 0.8)",
													}}
												/>
											}
										/>
									</LinearGradient>
								</TouchableOpacity>
								<Text
									style={{
										color: theme.colors.text,
										fontSize: 13,
										marginTop: 4,
										textAlign: "center",
										maxWidth: 80,
									}}
									className="font-semibold"
									numberOfLines={1}
								>
									{friend.nom}
								</Text>
							</ZoomableView>
						</View>
					))
				) : (
					<Pressable
						onPress={() => navigation.navigate("friendList")}
						className="px-4"
					>
						<ZoomableView>
							<LinearGradient
								colors={[theme.colors.purpleSecondary, theme.colors.cardBackground]}
								style={{
									width: 80,
									height: 80,
									borderRadius: 40,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Iconify
									icon="mdi:account-plus"
									color={theme.colors.primary}
									size={32}
								/>
							</LinearGradient>
							<Text
								style={{
									color: theme.colors.text,
									fontSize: 13,
									textAlign: "center",
									marginTop: 4,
								}}
								className="font-semibold"
							>
								{t("add_friends")}
							</Text>
						</ZoomableView>
					</Pressable>
				)}

				<Pressable onPress={inviteFriends} className="mr-2">
					<ZoomableView>
						<LinearGradient
							colors={[theme.colors.blueSecondary, theme.colors.cardBackground]}
							style={{
								width: 80,
								height: 80,
								borderRadius: 40,
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Iconify
								icon="material-symbols:share"
								color={theme.colors.primary}
								size={32}
							/>
						</LinearGradient>
						<Text
							style={{
								color: theme.colors.text,
								fontSize: 13,
								textAlign: "center",
								marginTop: 4,
							}}
							className="font-semibold"
						>
							{t("share_app")}
						</Text>
					</ZoomableView>
				</Pressable>
			</ScrollView>

			<FriendModal
				visible={visible}
				setVisible={setVisible}
				friend={selectedFriend}
			/>
		</>
	);
};

export default FriendPreview;
