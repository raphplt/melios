import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useSession } from "@context/UserContext";
import {
	getUserLevelsByUserId,
	initUserLevels,
	updateUserLevel,
} from "@db/levels";
import { UserLevel } from "@type/levels";
import React, { useEffect } from "react";
import { Button, Text, View } from "react-native";

const Levels = () => {
	const { theme } = useTheme();
	const { genericLevels, usersLevels, setUsersLevels } = useData();
	const { user } = useSession();

	useEffect(() => {
		const initializeLevels = async () => {
			if (!Object.keys(usersLevels).length) {
				await initUserLevels(user.uid, genericLevels);

				// Recharge les niveaux après initialisation
				const updatedLevels = await getUserLevelsByUserId(user.uid);
				setUsersLevels(updatedLevels);
			}
		};

		initializeLevels();
	}, [user, genericLevels, usersLevels]);

	const combinedLevels = Object.entries(usersLevels).map(
		([levelId, userLevel]) => {
			const genericLevel = genericLevels.find((level) => level.id === levelId);
			return {
				...userLevel,
				...genericLevel,
				levelId,
			};
		}
	);

	const addXp = async (levelId: string, xp: number) => {
		try {
			console.log("add xp", levelId, xp);

			// Met à jour Firebase
			await updateUserLevel(user.uid, levelId, xp);

			// Met à jour localement
			setUsersLevels((prev: UserLevel[]) => {
				if (!Array.isArray(prev)) return [];
				return prev.map((level) =>
					level.levelId === levelId ? { ...level, xp: (level.xp || 0) + xp } : level
				);
			});
		} catch (error) {
			console.error("Error updating XP: ", error);
		}
	};

	return (
		<View>
			<Text>
				User Levels and Generic Levels
				{combinedLevels.length}
			</Text>
			<View
				className="w-11/12 mx-auto"
				style={{ backgroundColor: theme.colors.backgroundSecondary }}
			>
				{combinedLevels.map((level) => (
					<View key={level.levelId} className=" bg-green-300 py-2 my-4 rounded-xl">
						<Text>{level.name}</Text>
						<Text>XP: {level.xp}</Text>
						<Text>Description: {level.description}</Text>
						<Text>Icon: {level.icon}</Text>
						<Button title="Add XP" onPress={() => addXp(level.levelId, 100)} />
					</View>
				))}
			</View>
		</View>
	);
};

export default Levels;
