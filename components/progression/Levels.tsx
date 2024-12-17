import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useData } from "@context/DataContext";
import { getUserLevelsByUserId, initUserLevels } from "@db/levels";
import SectionHeader from "./SectionHeader";
import LevelItem from "./LevelItem";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import NextLevel from "@components/Modals/NextLevel";

const Levels = () => {
	const { genericLevels, usersLevels, setUsersLevels, isLoading, member } =
		useData();
	const { t } = useTranslation();
	const [showLevels, setShowLevels] = useState(true);
	const [previousLevels, setPreviousLevels] = useState(usersLevels);
	const [showNextLevelModal, setShowNextLevelModal] = useState(false);
	const [nextLevelData, setNextLevelData] = useState<CombinedLevel | null>(null);

	if (!member) return null;

	useEffect(() => {
		const initializeLevels = async () => {
			if (!Object.keys(usersLevels).length && !isLoading) {
				await initUserLevels(member.uid, genericLevels);
				const updatedLevels = await getUserLevelsByUserId(member.uid);
				setUsersLevels(updatedLevels);
			}
		};

		initializeLevels();
	}, [member, genericLevels, usersLevels, isLoading]);

	useEffect(() => {
		// Check if any level has increased
		Object.entries(usersLevels).forEach(([levelId, userLevel]: any) => {
			const previousLevel = previousLevels[levelId];
			if (previousLevel && userLevel.currentLevel > previousLevel.currentLevel) {
				setShowNextLevelModal(true);
				setNextLevelData({
					...genericLevels.find((level) => level.id === levelId),
					...userLevel,
				});
			}
		});
		setPreviousLevels(usersLevels);
	}, [usersLevels]);

	const combinedLevels: CombinedLevel[] = Object.entries(usersLevels).map(
		([levelId, userLevel]) => {
			const genericLevel = genericLevels.find((level) => level.id === levelId);
			if (!genericLevel) {
				throw new Error(`Generic level not found for levelId: ${levelId}`);
			}
			return {
				...userLevel,
				...genericLevel,
				levelId,
				name: genericLevel.name || "Unknown",
				description: genericLevel.description || "",
				color: genericLevel.color || "#000",
				associatedCategoryIds: genericLevel.associatedCategoryIds || [],
			};
		}
	);

	return (
		<>
			<SectionHeader
				title={t("levels")}
				show={showLevels}
				setShow={setShowLevels}
				icon="levels"
			>
				<View className="w-[95%] mx-auto mb-2 mt-2">
					<ScrollView>
						{combinedLevels.map((item) => (
							<LevelItem key={item.levelId} level={item} />
						))}
					</ScrollView>
				</View>
			</SectionHeader>
			<NextLevel
				visible={showNextLevelModal}
				setVisible={setShowNextLevelModal}
				levelData={nextLevelData}
			/>
		</>
	);
};

export default Levels;
