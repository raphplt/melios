import { View, Text, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Link, useNavigation } from "expo-router";
import { Member } from "@type/member";
import getIcon from "@utils/cosmeticsUtils";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import UserBadge from "@components/Shared/UserBadge";

export default function MemberInfos({
	member,
	auth,
}: {
	member: Member | undefined;
	auth: any;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	useEffect(() => {
		const loadProfilePicture = () => {
			if (member?.profilePicture) {
				const uri = getIcon(member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [member]);

	return (
		<View style={{ backgroundColor: theme.colors.background }} className="mb-5">
			<View
				className="mx-auto flex flex-col pt-2 justify-center w-11/12 items-center"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ZoomableView>
					<Pressable onPress={() => navigation.navigate("cosmeticShop")}>
						<UserBadge width={144} height={144} />
					</Pressable>
				</ZoomableView>

				<View
					className="mx-auto flex flex-col items-center justify-center mt-2"
					style={{
						backgroundColor: theme.colors.background,
					}}
				>
					<Text
						className="text-xl mt-3"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{member?.nom}
					</Text>
					<Text
						className="mb-4 text-[16px] mt-1"
						style={{ color: theme.colors.textTertiary }}
					>
						{auth.currentUser?.email}
					</Text>
					<ZoomableView>
						<Pressable
							className="flex flex-row items-center py-3 px-8 rounded-full"
							style={{ backgroundColor: theme.colors.primary }}
							onPress={() => {
								navigation.navigate("editProfil");
							}}
						>
							<Text className="text-[16px] text-white">{t("edit_profile")}</Text>
						</Pressable>
					</ZoomableView>
				</View>
			</View>
		</View>
	);
}
