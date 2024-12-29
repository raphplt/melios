import CachedImage from "@components/Shared/CachedImage";
import { FontAwesome6 } from "@expo/vector-icons";
import getIcon from "@utils/cosmeticsUtils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { LogExtended } from "./AllLogs";
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";

export const LogItem = ({ item }: { item: LogExtended }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		const loadProfilePicture = () => {
			if (item.member?.profilePicture) {
				const uri = getIcon(item.member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [item.member]);

	const mostRecentDate: Date | undefined = item.logs
		.map((logDate: string) => new Date(logDate))
		.sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

	const lightColor = lightenColor(item.habit?.color || theme.colors.border, 0.1);

	return (
		<View
			className="mb-3 px-3 py-2 rounded-xl"
			style={{
				backgroundColor: lightColor || theme.colors.background,
				borderWidth: 2,
				borderColor: item.habit?.color || theme.colors.border,
			}}
		>
			<View className="flex flex-row items-center mb-2">
				<CachedImage
					imagePath={profilePictureUri || "images/cosmetics/man.png"}
					style={{ width: 32, height: 32, marginRight: 8 }}
				/>
				<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
					{item.member?.nom || "Nom inconnu"}{" "}
				</Text>
				<Text className=" " style={{ color: theme.colors.textTertiary }}>
					{t("has_done_habit")}
				</Text>
			</View>
			<View className="flex flex-row justify-center items-center my-2">
				<FontAwesome6
					name={item.habit?.icon || "question"}
					size={24}
					color={item.habit?.color || theme.colors.text}
				/>
			</View>
			<Text
				className=" font-semibold text-xl mb-2 text-center"
				style={{ color: theme.colors.text }}
			>
				{item.habit?.name || item.habitId}
			</Text>
			{mostRecentDate && (
				<Text className="text-sm" style={{ color: theme.colors.text }}>
					{t("the")} {mostRecentDate.toLocaleDateString("fr-FR")}
				</Text>
			)}
		</View>
	);
};
