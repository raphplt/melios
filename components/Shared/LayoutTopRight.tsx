import { View, Pressable } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";
import CachedImage from "./CachedImage";

export default function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { member } = useData();
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
		<View style={{ flexDirection: "row", alignItems: "center" }}>
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
