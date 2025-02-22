import React, { useEffect, useState } from "react";
import { CombinedLevel } from "@type/levels";
import NextLevel from "@components/Modals/NextLevel";
import { useData } from "@context/DataContext";
import { setRewards } from "@db/rewards";
import { genericLevels } from "@constants/levels";

export default function NextLevelHandler() {
	const { usersLevels } = useData();
	const [showNextLevelModal, setShowNextLevelModal] = useState(false);
	const [nextLevelData, setNextLevelData] = useState<CombinedLevel | null>(null);
	const [previousLevels, setPreviousLevels] = useState(usersLevels);

	useEffect(() => {
		Object.entries(usersLevels).forEach(([levelId, userLevel]: any) => {
			const previousLevel = previousLevels[levelId];
			if (previousLevel && userLevel.currentLevel > previousLevel.currentLevel) {
				setShowNextLevelModal(true);

				setNextLevelData({
					...genericLevels.find((level) => level.id === levelId),
					...userLevel,
				});

				setRewards("rewards", userLevel.currentLevel + 2);
			}
		});
		setPreviousLevels(usersLevels);
	}, [usersLevels]);

	// const levelData = {
	// 	id: "P0gwsxEYNJATbmCoOdhc",
	// 	name: "Niveau général",
	// 	description: "string",
	// 	color: "#FFC107",
	// 	icon: "compass",
	// 	slug: "level_general",
	// 	levelId: "P0gwsxEYNJATbmCoOdhc",
	// 	userId: "1",
	// 	currentLevel: "1",
	// 	currentXp: 100,
	// 	nextLevelXp: 89,
	// };

	return (
		<NextLevel
			visible={showNextLevelModal}
			setVisible={setShowNextLevelModal}
			levelData={nextLevelData}
		/>
	);
};
