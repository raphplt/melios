import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useSession } from "@context/UserContext";
import { initUserLevels } from "@db/levels";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

const Levels = () => {
	const { theme } = useTheme();
	const { genericLevels, usersLevels } = useData();
	const { user } = useSession();

	useEffect(() => {
		if (!usersLevels.length) {
			initUserLevels(user.uid, genericLevels);
		}
	}, [user, genericLevels, usersLevels]);

	const combinedLevels = usersLevels.map((userLevel) => {
		const genericLevel = genericLevels.find(
			(level) => level.id === userLevel.levelId
		);
		return {
			...userLevel,
			...genericLevel,
		};
	});

	console.log(combinedLevels);

	return (
		<View>
			<Text>User Levels and Generic Levels</Text>
			<View
				className="w-11/12 mx-auto p-2"
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
			>
				{combinedLevels.map((level) => (
					<View key={level.id} className="">
						{/* <Text>Level ID: {level.levelId}</Text> */}
						<Text>{level.name}</Text>
						<Text>XP: {level.xp}</Text>
						<Text>Description: {level.description}</Text>
						<Text>Icon: {level.icon}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

export default Levels;
