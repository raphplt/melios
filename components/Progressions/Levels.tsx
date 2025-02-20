import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useData } from "@context/DataContext";
import SectionHeader from "./SectionHeader";
import LevelItem from "./LevelItem";
import { CombinedLevel } from "@type/levels";
import { useTranslation } from "react-i18next";
import { genericLevels } from "@constants/levels";

export default function Levels() {
	const { usersLevels, member } = useData();
	const { t } = useTranslation();
	const [showLevels, setShowLevels] = useState(true);

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
		(level) => level.slug !== "level_general"
	);

	return (
		<>
			<SectionHeader
				title={t("skills")}
				show={showLevels}
				setShow={setShowLevels}
				icon="levels"
			>
				<View className="w-[94%] mx-auto">
					<ScrollView
						contentContainerStyle={{
							flexDirection: "row",
							flexWrap: "wrap",
							justifyContent: "space-between",
						}}
					>
						{filteredLevels.map((item) => (
							<LevelItem key={item.levelId} level={item} />
						))}
					</ScrollView>
				</View>
			</SectionHeader>
		</>
	);
}
