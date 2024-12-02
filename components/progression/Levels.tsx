import React, { useEffect, useState } from "react";
import { Button, Dimensions, Text, View } from "react-native";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useSession } from "@context/UserContext";
import {
	calculateNextLevelXp,
	getUserLevelsByUserId,
	initUserLevels,
	updateUserLevel,
} from "@db/levels";
import * as Progress from "react-native-progress";
import SectionHeader from "./SectionHeader";

const Levels = () => {
	const { theme } = useTheme();
	const { genericLevels, usersLevels, setUsersLevels } = useData();
	const { user } = useSession();
	const { width } = Dimensions.get("window");
	const [showLevels, setShowLevels] = useState(false);

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

	const updateLevel = (
		currentLevel: number,
		currentXp: number,
		xpToAdd: number
	) => {
		let newXp = currentXp + xpToAdd;
		let newLevel = currentLevel;
		let nextLevelXp = calculateNextLevelXp(newLevel);

		while (newXp >= nextLevelXp) {
			newXp -= nextLevelXp;
			newLevel += 1;
			nextLevelXp = calculateNextLevelXp(newLevel);
		}

		return {
			currentLevel: newLevel,
			currentXp: newXp,
			nextLevelXp: nextLevelXp,
		};
	};

	const addXp = async (levelId: any, xpToAdd: number) => {
		try {
			const currentLevelData = usersLevels[levelId];
			const { currentLevel, currentXp } = currentLevelData;

			// Calculer la progression
			const updatedLevel = updateLevel(currentLevel, currentXp, xpToAdd);

			// Met à jour Firebase
			await updateUserLevel(user.uid, levelId, {
				...currentLevelData,
				...updatedLevel,
			});

			// Met à jour localement
			setUsersLevels((prev) => ({
				...prev,
				[levelId]: {
					...prev[levelId],
					...updatedLevel,
				},
			}));
		} catch (error) {
			console.error("Error updating XP: ", error);
		}
	};

	return (
		<SectionHeader
			title="Niveaux"
			show={showLevels}
			setShow={setShowLevels}
			icon="levels"
		>
			<View className="w-[95%] mx-auto mb-2 mt-2">
				{combinedLevels.map((level) => (
					<View
						key={level.levelId}
						style={{
							backgroundColor: theme.colors.background,
							borderColor: theme.colors.border,
							borderWidth: 1,
						}}
						className="py-2 px-2 my-1 rounded-xl"
					>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-bold"
						>
							{level.name}
						</Text>
						<View className="flex flex-row items-center justify-between">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[14px] mb-1 font-semibold"
							>
								Niveau : {level.currentLevel}
							</Text>
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[14px] mb-1"
							>
								{level.currentXp} / {level.nextLevelXp}
							</Text>
						</View>
						<Progress.Bar
							progress={level.currentXp / level.nextLevelXp}
							width={width * 0.9}
							height={12}
							color={level.color || theme.colors.primary}
							borderRadius={15}
							borderWidth={0}
							style={{
								backgroundColor: theme.colors.border,
							}}
						/>

						<Text
							style={{
								color: theme.colors.textTertiary,
							}}
							className="text-[13px] mt-1"
						>
							{level.description}
						</Text>
						{/* <Button title="Add XP" onPress={() => addXp(level.levelId, 100)} /> */}
					</View>
				))}
			</View>
		</SectionHeader>
	);
};

export default Levels;
