import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { useData } from "@context/DataContext";
import { useSession } from "@context/UserContext";
import { getUserLevelsByUserId, initUserLevels } from "@db/levels";
import SectionHeader from "./SectionHeader";
import LevelItem from "./LevelItem";
import { CombinedLevel } from "@type/levels";

const Levels = () => {
	const { genericLevels, usersLevels, setUsersLevels } = useData();
	const { user } = useSession();
	const [showLevels, setShowLevels] = useState(true);

	useEffect(() => {
		const initializeLevels = async () => {
			if (!Object.keys(usersLevels).length) {
				await initUserLevels(user.uid, genericLevels);
				const updatedLevels = await getUserLevelsByUserId(user.uid);
				setUsersLevels(updatedLevels);
			}
		};

		initializeLevels();
	}, [user, genericLevels, usersLevels]);

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
		<SectionHeader
			title="Niveaux"
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
	);
};

export default Levels;
