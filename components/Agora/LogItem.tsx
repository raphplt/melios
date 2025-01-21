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
import { useData } from "@context/DataContext";

export const LogItem = ({ item }: { item: LogExtended }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const [popoverVisible, setPopoverVisible] = useState(false);
	const [userReaction, setUserReaction] = useState<string | null>(null);
	const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
		{}
	);
	const { member } = useData();

	useEffect(() => {
		const userReaction = item.reactions?.find(
			(reaction) => reaction.uid === member?.uid
		);
		if (userReaction) {
			setUserReaction(userReaction.type);
		}
	}, [item.reactions, member]);

	useEffect(() => {
		const loadProfilePicture = () => {
			if (item.member?.profilePicture) {
				const uri = getIcon(item.member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
	}, [item.member]);

	useEffect(() => {
		const counts =
			item.reactions?.reduce((acc: Record<string, number>, reaction) => {
				acc[reaction.type] = (acc[reaction.type] || 0) + 1;
				return acc;
			}, {}) || {};
		setReactionCounts(counts);
	}, [item.reactions]);

	const handleReaction = async (type: string) => {
		try {
			const memberUid = member?.uid || "";

			if (userReaction === type) {
				await removeReactionFromLog(item.id, memberUid, type);
				setUserReaction(null);
				setReactionCounts((prev) => {
					const newCounts = { ...prev, [type]: (prev[type] || 1) - 1 };
					if (newCounts[type] === 0) {
						delete newCounts[type];
					}
					return newCounts;
				});
			} else {
				if (userReaction) {
					await removeReactionFromLog(item.id, memberUid, userReaction);
					setReactionCounts((prev) => {
						const newCounts = {
							...prev,
							[userReaction]: (prev[userReaction] || 1) - 1,
						};
						if (newCounts[userReaction] === 0) {
							delete newCounts[userReaction];
						}
						return newCounts;
					});
				}
				await addReactionToLog(item.id, memberUid, type);
				setUserReaction(type);
				setReactionCounts((prev) => ({
					...prev,
					[type]: (prev[type] || 0) + 1,
				}));
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

	const getReactionIcons = () => {
		return Object.keys(reactionCounts).map((reaction) => {
			if (reactionCounts[reaction] > 0) {
				return <View key={reaction}>{renderEmoji(reaction)}</View>;
			}
			return null;
		});
	};

	if (!item.member || !item.habit) return null;

	const renderEmoji = (emoji: string) => {
		switch (emoji) {
			case "flame":
				return (
					<Iconify icon="mdi-fire" size={20} color={theme.colors.orangePrimary} />
				);
			case "heart":
				return (
					<Iconify icon="mdi-heart" size={20} color={theme.colors.redPrimary} />
				);
			case "like":
				return (
					<Iconify icon="mdi-thumb-up" size={20} color={theme.colors.primary} />
				);
			default:
				return <Iconify icon="mdi-help" size={20} color="gray" />;
		}
	};

	return (
		<View
			className="mb-3 px-3 py-2 rounded-xl"
			style={{
				backgroundColor: bgColor,
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
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
					style={{ flexDirection: "row", alignItems: "center" }}
					// className="px-1"
				>
					{Object.keys(reactionCounts).length > 0 ? (
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: theme.colors.background,
								borderRadius: 20,
							}}
							className="px-2 py-1"
						>
							{getReactionIcons()}
							<Text style={{ color: theme.colors.text, marginLeft: 5 }}>
								{Object.values(reactionCounts).reduce((a, b) => a + b, 0)}
							</Text>
						</View>
					) : (
						<View
							className="flex flex-row items-center p-2 rounded-full"
							style={{
								backgroundColor: theme.colors.background,
							}}
						>
							<Iconify icon="mdi-heart" size={20} color={theme.colors.redPrimary} />
						</View>
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
						<View className="w-10/12 mt-3 flex flex-row justify-evenly items-center">
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
												? theme.colors.backgroundTertiary
												: theme.colors.cardBackground,
										borderRadius: 10,
										borderColor: theme.colors.border,
										borderWidth: 1,
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