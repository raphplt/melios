import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { View, Pressable } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";
import CachedImage from "./CachedImage";
import AnimatedPlaceholder from "./AnimatedPlaceholder";

function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { member } = useData();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (member?.profilePicture) {
			const uri = getIcon(member.profilePicture);
			setProfilePictureUri(uri);
		} else {
			setProfilePictureUri(null);
		}
	}, [member]);

	const handlePress = useCallback(() => {
		navigation.navigate("account");
	}, [navigation]);

	const imagePath = useMemo(
		() => profilePictureUri || "images/cosmetics/man.png",
		[profilePictureUri]
	);

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }} className="mb-1">
			<View className="px-2"></View>
			<Points />
			<Pressable onPress={handlePress} className="ml-3">
				<CachedImage
					imagePath={imagePath}
					style={{ width: 32, height: 32, marginRight: 20 }}
					placeholder={<AnimatedPlaceholder marginRight={20} />}
				/>
			</Pressable>
		</View>
	);
}

export default memo(LayoutTopRight);
