import React, { memo, useCallback, useEffect, useState, useMemo } from "react";
import { View, Pressable, Text } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";
import CachedImage from "./CachedImage";
import AnimatedPlaceholder from "./AnimatedPlaceholder";
import * as Progress from "react-native-progress";
import { getGlobalLevel } from "@utils/levels";
import { useTheme } from "@context/ThemeContext";
import useIndex from "@hooks/useIndex";

function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { member, usersLevels } = useData();
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

	const globalLevel = getGlobalLevel(usersLevels);

	const xpPercentage = globalLevel
		? (globalLevel.currentXp / globalLevel.nextLevelXp) * 100
		: 0;
	const { theme } = useTheme();
	const { isDayTime } = useIndex();

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }} className="mb-1">
			<View className="flex flex-row items-center gap-2">
				<View className="flex items-center justify-center flex-row ">
					<Progress.Circle
						size={30}
						progress={xpPercentage / 100}
						color={isDayTime ? theme.colors.primary : theme.colors.tertiary}
						unfilledColor={theme.colors.border}
						borderWidth={0}
						thickness={4}
					/>
					<Text
						style={{
							fontSize: 14,
							color: isDayTime ? theme.colors.primary : theme.colors.tertiary,
						}}
						className="font-bold absolute text-lg"
					>
						{globalLevel?.currentLevel || "1"}
					</Text>
				</View>
				<Points />
			</View>
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
