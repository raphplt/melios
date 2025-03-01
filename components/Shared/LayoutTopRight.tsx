import { View, Pressable } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";
import CachedImage from "./CachedImage";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";

export default function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { member } = useData();
	const { theme } = useTheme();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

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
		<View style={{ flexDirection: "row", alignItems: "center" }} className="mb-1">
			<View className="px-2"></View>
			<Points />
			<Pressable onPress={() => navigation.navigate("account")} className="ml-3">
				<CachedImage
					imagePath={profilePictureUri || "images/cosmetics/man.png"}
					style={{ width: 32, height: 32, marginRight: 20 }}
				/>
			</Pressable>
		</View>
	);
}
