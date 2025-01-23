// LogItem.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Text, View, Pressable } from "react-native";
import CachedImage from "@components/Shared/CachedImage";
import { FontAwesome6 } from "@expo/vector-icons";
import { Iconify } from "react-native-iconify";
import ModalWrapper from "@components/Modals/ModalWrapper";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { lightenColor } from "@utils/colors";
import getIcon from "@utils/cosmeticsUtils";
import {
	addReactionToLog,
	removeReactionFromLog,
	REACTION_TYPES,
} from "@db/logs";
import { useData } from "@context/DataContext";
import { LogExtended } from "./AllLogs";
import { DailyLog } from "@type/log";
import { CategoryTypeSelect } from "@utils/category.type";

/**
 * Carte qui affiche la complétion d'un DailyLog (un jour précis)
 */
const DailyLogCard = ({
	logId,
	dailyLog,
	habitColor,
	habitType,
	userName,
	userPictureUri,
	habitName,
}: {
	logId: string;
	dailyLog: DailyLog;
	habitColor: string;
	habitType: string;
	userName: string;
	userPictureUri: string | null;
	habitName: string;
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();

	// État local pour la popover (choix d’une réaction)
	const [popoverVisible, setPopoverVisible] = useState(false);

	// Détermine la réaction actuelle de l’utilisateur (s’il y en a une)
	const userReaction = useMemo(() => {
		return dailyLog.reactions?.find((r) => r.uid === member?.uid)?.type || null;
	}, [dailyLog.reactions, member?.uid]);

	// Compte le nombre de réactions par type
	const reactionCounts = useMemo(() => {
		return (
			dailyLog.reactions?.reduce((acc: Record<string, number>, r) => {
				acc[r.type] = (acc[r.type] || 0) + 1;
				return acc;
			}, {}) || {}
		);
	}, [dailyLog.reactions]);

	// Gère l’ajout/suppression de réaction
	const handleReaction = async (type: string) => {
		try {
			if (!member?.uid) return;
			const logDateISO = dailyLog.date.toISOString();

			if (userReaction === type) {
				// Retirer la réaction existante
				await removeReactionFromLog(logId, member.uid, type, logDateISO);
			} else {
				// Retirer la précédente si elle existe
				if (userReaction) {
					await removeReactionFromLog(logId, member.uid, userReaction, logDateISO);
				}
				// Ajouter la nouvelle
				await addReactionToLog(logId, member.uid, type, logDateISO);
			}

			// Pour voir le changement immédiatement, tu peux re-fetch
			// ou utiliser un onSnapshot. Ici on reste simple.
		} catch (error) {
			console.error("Erreur lors de la gestion de la réaction :", error);
		} finally {
			setPopoverVisible(false);
		}
	};

	// Rendu d’un emoji selon le type de réaction
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

	// Couleur de fond du bloc en fonction du type
	const bgColor =
		habitType === CategoryTypeSelect.negative
			? theme.colors.redPrimary
			: lightenColor(habitColor, 0.1);

	const dateString = dailyLog.date.toLocaleDateString("fr-FR");

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
			{/* Header (utilisateur) */}
			<View className="flex flex-row items-center mb-2">
				<CachedImage
					imagePath={userPictureUri || "images/cosmetics/man.png"}
					style={{ width: 32, height: 32, marginRight: 8 }}
				/>
				<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
					{userName || "Nom inconnu"}{" "}
				</Text>
				<Text style={{ color: theme.colors.textTertiary }}>
					{t("has_done_habit")}
				</Text>
			</View>

			{/* Titre de l’habitude */}
			<Text
				className="font-semibold text-xl mb-2 text-center"
				style={{ color: theme.colors.text }}
			>
				{habitName}
			</Text>

			{/* Footer : date + réactions */}
			<View className="flex flex-row justify-between items-center mt-2">
				<Text style={{ color: theme.colors.text }}>
					{t("the")} {dateString}
				</Text>

				<Pressable
					onPress={() => setPopoverVisible(true)}
					style={{ flexDirection: "row", alignItems: "center" }}
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
							{Object.entries(reactionCounts).map(([reactionType, count]) => {
								if (!count) return null;
								return (
									<View
										key={reactionType}
										style={{ flexDirection: "row", marginRight: 6 }}
									>
										{renderEmoji(reactionType)}
										<Text style={{ color: theme.colors.text, marginLeft: 2 }}>
											{count}
										</Text>
									</View>
								);
							})}
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

export const LogItem = ({ item }: { item: LogExtended }) => {
	// item représente un log complet : une habitude pour un user, + toutes ses dates

	const { theme } = useTheme();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (item.member?.profilePicture) {
			setProfilePictureUri(getIcon(item.member.profilePicture));
		}
	}, [item.member]);

	// On trie les dailyLogs de l’habitude par date desc
	const sortedDailyLogs = [...item.logs].sort(
		(a, b) => b.date.getTime() - a.date.getTime()
	);

	// console.log("dailyLogs", sortedDailyLogs);

	// Si le log ne contient aucun dailyLog valide, on n’affiche rien
	if (!sortedDailyLogs.length) return null;

	return (
		<View style={{ marginBottom: 10 }}>
			{sortedDailyLogs.map((dailyLog, idx) => (
				<DailyLogCard
					key={`${item.id}-${dailyLog.date.toISOString()}-${idx}`}
					logId={item.id}
					dailyLog={dailyLog}
					habitColor={item.habit?.color || theme.colors.border}
					habitType={item.habit?.type || ""}
					userName={item.member?.nom || "??"}
					userPictureUri={profilePictureUri}
					habitName={item.habit?.name || item.habitId}
				/>
			))}
		</View>
	);
};
