import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useData } from "@context/DataContext";
import SectionHeader from "./SectionHeader";
import LevelItem from "./LevelItem";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { useHabits } from "@context/HabitsContext";

export default function Levels() {
	const { usersLevels, member } = useData();
	const { genericLevels, refreshGenericLevels, setGenericLevels } = useHabits();
	const { t } = useTranslation();
	const [showLevels, setShowLevels] = useState(true);
	const [hasRefetched, setHasRefetched] = useState(false);

	useEffect(() => {
		if (!member) return;
		const missingIcon = genericLevels.some((level) => !level.icon);
		if (missingIcon && !hasRefetched) {
			refreshGenericLevels(true);
			setHasRefetched(true);
			setGenericLevels(genericLevels);
		}
	}, [genericLevels, hasRefetched, refreshGenericLevels, member]);

	if (!member) return null;
	const combinedLevels: CombinedLevel[] = Object.entries(usersLevels)
		.map(([levelId, userLevel]) => {
			const genericLevel = genericLevels.find((level) => level.id === levelId);
			if (!genericLevel) {
				return null;
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
		})
		.filter((level): level is CombinedLevel => level !== null);

	const filteredLevels = combinedLevels.filter(
		(level) => level.name !== "Niveau général"
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
						{filteredLevels.map((item) => (
							<LevelItem key={item.levelId} level={item} />
						))}
					</ScrollView>
				</View>
			</SectionHeader>
		</>
	);
}
