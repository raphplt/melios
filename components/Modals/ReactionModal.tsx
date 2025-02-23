import React, { useRef } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import ModalWrapper from "@components/Modals/ModalWrapper";
import { Iconify } from "react-native-iconify";
import {
	REACTION_TYPES,
	addReactionToLog,
	removeReactionFromLog,
} from "@db/logs";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ReactionModalProps {
	visible: boolean;
	setVisible: (v: boolean) => void;
	item: any;
	member: any;
	theme: any;
	t: any;
	userReaction: string | null;
	reactions: any[];
	setReactions: React.Dispatch<React.SetStateAction<any[]>>;
	safeDate: Date;
}

interface ReactionEmojiProps {
	type: string;
	theme: any;
	onPress: (type: string) => void;
	isSelected: boolean;
}

const ReactionEmoji: React.FC<ReactionEmojiProps> = ({
	type,
	theme,
	onPress,
	isSelected,
}) => {
	// Animation propre à cet emoji
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const animatePress = () => {
		Animated.sequence([
			Animated.spring(scaleAnim, {
				toValue: 1.2,
				friction: 3,
				useNativeDriver: true,
			}),
			Animated.spring(scaleAnim, {
				toValue: 1,
				friction: 3,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handlePress = () => {
		animatePress();
		onPress(type);
	};

	const renderIcon = () => {
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

	return (
		<Pressable
			onPress={handlePress}
			style={{
				padding: 10,
				marginHorizontal: 5,
				backgroundColor: isSelected
					? theme.colors.backgroundTertiary
					: theme.colors.cardBackground,
				borderRadius: 10,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
				{renderIcon()}
			</Animated.View>
		</Pressable>
	);
};

export default function ReactionModal({
	visible,
	setVisible,
	item,
	member,
	theme,
	t,
	userReaction,
	reactions,
	setReactions,
	safeDate,
}: ReactionModalProps) {
	const handleReaction = async (type: string) => {
		if (!member?.uid) return;
		try {
			await AsyncStorage.setItem("LATEST_REACTION", new Date().toISOString());
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
				await addReactionToLog(
					habitLogId,
					dailyLogId,
					member.uid,
					type,
					logDateISO
				);
				setReactions((prev) => [...prev, { uid: member.uid, type }]);
			}
		} catch (err) {
			console.error("Erreur reaction:", err);
		} finally {
			setVisible(false);
		}
	};

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View style={{ alignItems: "center" }}>
				<Text
					style={{ color: theme.colors.text, fontWeight: "bold", marginBottom: 10 }}
				>
					{t("choose_reaction")}
				</Text>
				<View
					style={{
						width: "83%",
						marginTop: 10,
						flexDirection: "row",
						justifyContent: "space-evenly",
						alignItems: "center",
					}}
				>
					{REACTION_TYPES.map((reaction) => (
						<ReactionEmoji
							key={reaction}
							type={reaction}
							theme={theme}
							onPress={handleReaction}
							isSelected={userReaction === reaction}
						/>
					))}
				</View>
			</View>
		</ModalWrapper>
	);
}
