import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import BottomSlideModal from "./ModalBottom";
import { Member } from "@type/member";
import { useEffect, useState } from "react";
import { getUserLevelsByUserId } from "@db/levels";
import { UserLevel } from "@type/levels";

export default function FriendModal({
	visible,
	setVisible,
	friend,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	friend: Partial<Member> | null;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [levels, setLevels] = useState<{ [key: string]: UserLevel }>({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchLevels = async () => {
			if (friend && friend.uid) {
				try {
					const userLevels = await getUserLevelsByUserId(friend.uid);
					setLevels(userLevels);
				} catch (error) {
					console.error("Error fetching user levels: ", error);
				} finally {
					setLoading(false);
				}
			}
		};

		if (visible) {
			fetchLevels();
		}
	}, [friend, visible]);

	return (
		<BottomSlideModal visible={visible} setVisible={setVisible}>
			<View className="w-11/12 mx-auto py-5">
				{friend && (
					<View>
						<Text
							style={{ color: theme.colors.text }}
							className="text-center font-semibold text-lg"
						>
							{friend.nom}
						</Text>
					</View>
				)}
				{loading ? (
					<ActivityIndicator size="large" color={theme.colors.primary} />
				) : (
					<View>
						{Object.keys(levels).length > 0 ? (
							Object.values(levels).map((level) => (
								<View key={level.levelId} className="my-2">
									<Text style={{ color: theme.colors.text }}>
										{/* {t("level")}: {level.id} */}
									</Text>
									<Text style={{ color: theme.colors.text }}>
										{t("level")}: {level.currentLevel}
									</Text>
									<Text style={{ color: theme.colors.text }}>
										{t("current_xp")}: {level.currentXp}
									</Text>
									<Text style={{ color: theme.colors.text }}>
										{t("next_level_xp")}: {level.nextLevelXp}
									</Text>
								</View>
							))
						) : (
							<Text style={{ color: theme.colors.text }}>{t("no_levels_found")}</Text>
						)}
					</View>
				)}
			</View>
		</BottomSlideModal>
	);
}
