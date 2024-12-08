import { View, Text, Image, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Member } from "@type/member";
import getIcon from "@utils/cosmeticsUtils";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { useState, useEffect } from "react";

export default function MemberInfos({
	member,
	auth,
}: {
	member: Member | undefined;
	auth: any;
}) {
	const { theme } = useTheme();
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		const loadProfilePicture = async () => {
			if (member?.profilePicture) {
				const uri = await getIcon(member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [member]);

	return (
		<View style={{ backgroundColor: theme.colors.background }} className="mb-5">
			<View
				className="mx-auto flex flex-col pt-6 justify-center w-11/12 items-center"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ZoomableView>
					<Pressable onPress={() => navigation.navigate("cosmeticShop")}>
						<CachedImage
							imagePath={profilePictureUri || "images/cosmetics/man.png"}
							style={{ width: 144, height: 144 }}
						/>
					</Pressable>
				</ZoomableView>

				<View
					className="mx-auto flex flex-col items-center justify-center"
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
							<Text className="text-[16px] text-white">Éditer le profil</Text>
						</Pressable>
					</ZoomableView>
				</View>
			</View>
		</View>
	);
}
