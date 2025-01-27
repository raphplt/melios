import React, { useState, useEffect, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
import CachedImage from "@components/Shared/CachedImage";
import ModalWrapper from "@components/Modals/ModalWrapper";
import { Iconify } from "react-native-iconify";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import getIcon from "@utils/cosmeticsUtils";
import {
	REACTION_TYPES,
	addReactionToLog,
	removeReactionFromLog,
} from "@db/logs";
import { useData } from "@context/DataContext";
import { DailyLogExtended } from "@db/logs";
import { CategoryTypeSelect } from "@utils/category.type";
import { FontAwesome6 } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";

export const DailyLogItem = ({ item }: { item: DailyLogExtended }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();

	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const [popoverVisible, setPopoverVisible] = useState(false);
	const [reactions, setReactions] = useState(item.reactions);

	const safeDate = useMemo(() => {
		if (item.date instanceof Date) return item.date;
		if (item.date && typeof (item.date as any).toDate === "function") {
			return (item.date as Timestamp).toDate();
		}
		return new Date(item.date);
	}, [item.date]);

	useEffect(() => {
		if (item.user?.profilePicture) {
			setProfilePictureUri(getIcon(item.user.profilePicture));
		}
	}, [item.user]);

	const userReaction = useMemo(() => {
		return reactions.find((r) => r.uid === member?.uid)?.type || null;
	}, [reactions, member?.uid]);

	const reactionCounts = useMemo(() => {
		return reactions.reduce((acc: Record<string, number>, r) => {
			acc[r.type] = (acc[r.type] || 0) + 1;
			return acc;
		}, {});
	}, [reactions]);

	const isNegative = item.habit?.type === CategoryTypeSelect.negative;
	const bgColor = isNegative
		? theme.colors.redPrimary
		: lightenColor(item.habit?.color || theme.colors.border, 0.1);

const handleReaction = async (type: string) => {
	if (!member?.uid) return;

	try {
		const habitLogId = item.logDocId;
		const dailyLogId = item.id;

		const logDateISO = safeDate.toISOString();

		if (userReaction === type) {
			await removeReactionFromLog(
				habitLogId,
				dailyLogId,
				member.uid,
				type,
				logDateISO
			);
			setReactions((prev) =>
				prev.filter((r) => !(r.uid === member.uid && r.type === type))
			);
		} else {
			if (userReaction) {
				await removeReactionFromLog(
					habitLogId,
					dailyLogId,
					member.uid,
					userReaction,
					logDateISO
				);
				setReactions((prev) =>
					prev.filter((r) => !(r.uid === member.uid && r.type === userReaction))
				);
			}
			await addReactionToLog(habitLogId, dailyLogId, member.uid, type, logDateISO);
			setReactions((prev) => [...prev, { uid: member.uid, type }]);
		}
	} catch (err) {
		console.error("Erreur reaction:", err);
	} finally {
		setPopoverVisible(false);
	}
};

const renderEmoji = (type: string) => {
	switch (type) {
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

const dateString = safeDate.toLocaleDateString("fr-FR");

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
			{/* Header : user */}
			<View className="flex flex-row items-center mb-2">
				<CachedImage
					imagePath={profilePictureUri || "images/cosmetics/man.png"}
					style={{ width: 32, height: 32, marginRight: 8 }}
				/>
				<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
					{item.user?.nom || "??"}
				</Text>
				<Text style={{ marginLeft: 6, color: theme.colors.textTertiary }}>
					{t("has_done_habit")}
				</Text>
			</View>

			{/* Nom de l'habitude */}
			<Text
				className="font-semibold text-lg mb-2 text-center"
				style={{ color: theme.colors.text }}
			>
				{item.habit?.name || ""}
			</Text>
			<View className="flex flex-row justify-center items-center">
				<FontAwesome6
					name={item.habit?.icon || "question"}
					size={28}
					color={item.habit?.color ?? theme.colors.text}
				/>
			</View>

			{/* Footer : date + bouton réactions */}
			<View className="flex flex-row justify-between items-center">
				<Text style={{ color: theme.colors.text }}>
					{t("the")} {dateString}
				</Text>

				<Pressable onPress={() => setPopoverVisible(true)}>
					{Object.keys(reactionCounts).length ? (
						<View
							className="px-2 py-1 rounded-2xl"
							style={{
								flexDirection: "row",
								alignItems: "center",
								backgroundColor: theme.colors.background,
							}}
						>
							{Object.entries(reactionCounts).map(([rType, count]) => (
								<View key={rType} style={{ flexDirection: "row", marginHorizontal: 3 }}>
									{renderEmoji(rType)}
									<Text style={{ color: theme.colors.text, marginLeft: 3 }}>
										{count}
									</Text>
								</View>
							))}
						</View>
					) : (
						<View
							className="p-2 rounded-full"
							style={{ backgroundColor: theme.colors.background }}
						>
							<Iconify icon="mdi-heart" size={20} color={theme.colors.redPrimary} />
						</View>
					)}
				</Pressable>
			</View>

			{/* Popover pour choisir la réaction */}
			<ModalWrapper visible={popoverVisible} setVisible={setPopoverVisible}>
				<View className="flex flex-col items-center">
					<Text
						style={{ color: theme.colors.text, fontWeight: "bold", marginBottom: 10 }}
					>
						{t("choose_reaction")}
					</Text>
					<View className="w-10/12 mt-3 flex flex-row justify-evenly items-center">
						{REACTION_TYPES.map((reaction) => (
							<Pressable
								key={reaction}
								onPress={() => handleReaction(reaction)}
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
	);
};