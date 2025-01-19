import CachedImage from "@components/Shared/CachedImage";
import { FontAwesome6 } from "@expo/vector-icons";
import getIcon from "@utils/cosmeticsUtils";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View, Modal } from "react-native";
import { LogExtended } from "./AllLogs";
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import { CategoryTypeSelect } from "@utils/category.type";
import {
	removeReactionFromLog,
	addReactionToLog,
	REACTION_TYPES,
} from "@db/logs";
import { Iconify } from "react-native-iconify";
import ModalWrapper from "@components/Modals/ModalWrapper";

export const renderEmoji = (emoji: string) => {
	switch (emoji) {
		case "flame":
			return <Iconify icon="mdi-fire" size={24} color="red" />;
		case "heart":
			return <Iconify icon="mdi-heart" size={24} color="red" />;
		case "like":
			return <Iconify icon="mdi-thumb-up" size={24} color="blue" />;
		default:
			return <Iconify icon="mdi-help" size={24} color="gray" />;
	}
};

export const LogItem = ({ item }: { item: LogExtended }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const [popoverVisible, setPopoverVisible] = useState(false);
	const [userReaction, setUserReaction] = useState<string | null>(null);

	// Calcul des réactions par type
	const reactionCounts =
		item.reactions?.reduce((acc: Record<string, number>, reaction) => {
			acc[reaction.type] = (acc[reaction.type] || 0) + 1;
			return acc;
		}, {}) || {};

	useEffect(() => {
		const loadProfilePicture = () => {
			if (item.member?.profilePicture) {
				const uri = getIcon(item.member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [item.member]);

	const handleReaction = async (type: string) => {
		try {
			if (userReaction === type) {
				await removeReactionFromLog(item.id, item.uid, type);
				setUserReaction(null);
			} else {
				await addReactionToLog(item.id, item.uid, type);
				setUserReaction(type);
			}
		} catch (error) {
			console.error("Erreur lors de la gestion de la réaction :", error);
		}
	};

	const mostRecentDate: Date | undefined = item.logs
		.map((logDate: string) => new Date(logDate))
		.sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

	const lightColor = lightenColor(item.habit?.color || theme.colors.border, 0.1);
	const bgColor =
		item.habit?.type === CategoryTypeSelect.negative
			? theme.colors.redPrimary
			: lightColor;

	if (!item.member || !item.habit) return null;

	return (
		<View
			className="mb-3 px-3 py-2 rounded-xl"
			style={{
				backgroundColor: bgColor,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.3,
				shadowRadius: 4,
			}}
		>
			{/* Header */}
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

			{/* Habit Info */}
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

			<View
				className="flex flex-row justify-between items-center"
				style={{ marginTop: 10 }}
			>
				{mostRecentDate && (
					<Text className="text-sm" style={{ color: theme.colors.text }}>
						{t("the")} {mostRecentDate.toLocaleDateString("fr-FR")}
					</Text>
				)}

				{/* Reactions Count & Popover Trigger */}
				<Pressable
					onPress={() => setPopoverVisible(true)}
					style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
				>
					{Object.keys(reactionCounts).length > 0 ? (
						Object.entries(reactionCounts).map(([reaction, count]) => (
							<View
								key={reaction}
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}
							>
								{renderEmoji(reaction)}
								<Text style={{ color: theme.colors.text, marginLeft: 5 }}>{count}</Text>
							</View>
						))
					) : (
						<>
							<Iconify icon="mdi-heart" size={24} color={theme.colors.redPrimary} />
							<Text style={{ color: theme.colors.text, marginLeft: 5 }}>0</Text>
						</>
					)}
				</Pressable>

				{/* Popover for Reactions */}
				<ModalWrapper visible={popoverVisible} setVisible={setPopoverVisible}>
					<View className="flex flex-col items-center justify-start">
						<Text
							style={{
								color: theme.colors.text,
								fontWeight: "bold",
								marginBottom: 10,
							}}
						>
							{t("choose_reaction")}
						</Text>
						<View
							style={{ flexDirection: "row", justifyContent: "center" }}
							className="w-2/3"
						>
							{REACTION_TYPES.map((reaction) => (
								<Pressable
									key={reaction}
									onPress={() => {
										handleReaction(reaction);
										setPopoverVisible(false);
									}}
									style={{
										padding: 10,
										marginHorizontal: 5,
										backgroundColor:
											userReaction === reaction
												? theme.colors.primary
												: theme.colors.backgroundTertiary,
										borderRadius: 10,
									}}
								>
									{renderEmoji(reaction)}
								</Pressable>
							))}
						</View>
					</View>
				</ModalWrapper>
			</View>
		</View>
	);
};
