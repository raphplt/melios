import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from "react-native";
import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { Member } from "@type/member";
import getIcon from "@utils/cosmeticsUtils";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import {
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
} from "@db/friend";

type Props = {
	member: Member;
};

const Friend = ({ member }: Props) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	const { member: currentUser, setMember } = useData();
	if (!currentUser) return null;

	const [isFriend, setIsFriend] = useState(
		(currentUser.friends ?? []).includes(member.uid)
	);
	const [requestSent, setRequestSent] = useState(
		currentUser.friendRequestsSent?.includes(member.uid) ?? false
	);
	const [requestReceived, setRequestReceived] = useState(
		currentUser.friendRequestsReceived?.includes(member.uid) ?? false
	);

	useEffect(() => {
		if (member?.profilePicture) {
			const uri = getIcon(member.profilePicture);
			setProfilePictureUri(uri);
		}
	}, [member]);

	const handleSendRequest = async () => {
		setLoading(true);
		try {
			if (!member.uid) return;
			await sendFriendRequest(member.uid);
			setRequestSent(true);
			setMember((prevData) => {
				if (!prevData) return prevData;
				return {
					...prevData,
					friendRequestsSent: [...(prevData.friendRequestsSent ?? []), member.uid],
				};
			});
		} catch (error) {
			console.error("Erreur lors de l'envoi de la demande :", error);
		} finally {
			setLoading(false);
		}
	};

	const handleAcceptRequest = async () => {
		setLoading(true);
		try {
			await acceptFriendRequest(member.uid);
			setIsFriend(true);
			setRequestReceived(false);
			setMember((prevData) => {
				if (!prevData) return prevData;
				return {
					...prevData,
					friends: [...(prevData.friends ?? []), member.uid],
					friendRequestsReceived: (prevData.friendRequestsReceived ?? []).filter(
						(uid) => uid !== member.uid
					),
				};
			});
		} catch (error) {
			console.error("Erreur lors de l'acceptation de la demande :", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDeclineRequest = async () => {
		setLoading(true);
		try {
			await declineFriendRequest(member.uid);
			setRequestReceived(false);
			setMember((prevData) => {
				if (!prevData) return prevData;
				return {
					...prevData,
					friendRequestsReceived: (prevData.friendRequestsReceived ?? []).filter(
						(uid) => uid !== member.uid
					),
				};
			});
		} catch (error) {
			console.error("Erreur lors du refus de la demande :", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View
			style={{
				borderWidth: 1,
				borderColor: theme.colors.border,
				borderRadius: 12,
				backgroundColor: theme.colors.cardBackground,
				padding: 16,
				marginVertical: 8,
				marginHorizontal: 4,
				shadowColor: "#000",
				shadowOpacity: 0.1,
				shadowRadius: 8,
				elevation: 2,
				alignItems: "center",
				width: "47%",
			}}
			className="mx-auto"
		>
			<CachedImage
				imagePath={profilePictureUri || "images/cosmetics/man.png"}
				style={{
					width: 70,
					height: 70,
					borderRadius: 35,
					marginBottom: 8,
				}}
			/>
			<Text
				style={{
					fontSize: 16,
					fontWeight: "600",
					color: theme.colors.text,
					textAlign: "center",
					marginBottom: 8,
				}}
			>
				{member.nom}
			</Text>
			{loading ? (
				<ActivityIndicator size="small" color={theme.colors.primary} />
			) : isFriend ? (
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						backgroundColor: theme.colors.primary,
						paddingVertical: 6,
						paddingHorizontal: 12,
						borderRadius: 8,
					}}
				>
					<Iconify icon="mdi:account-check" size={20} color="white" />
					<Text
						style={{
							color: theme.colors.textSecondary,
							fontSize: 14,
							marginLeft: 6,
						}}
					>
						{t("is_friend")}
					</Text>
				</View>
			) : requestSent ? (
				<Text
					style={{
						color: theme.colors.textTertiary,
						fontSize: 14,
						marginTop: 4,
					}}
				>
					{t("request_sent")}
				</Text>
			) : requestReceived ? (
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						width: "100%",
						marginTop: 8,
					}}
				>
					<TouchableOpacity
						onPress={handleAcceptRequest}
						style={{
							backgroundColor: theme.colors.primary,
							padding: 8,
							borderRadius: 8,
							flex: 1,
							marginRight: 4,
							alignItems: "center",
						}}
					>
						<Iconify icon="material-symbols:done" size={20} color="white" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleDeclineRequest}
						style={{
							backgroundColor: theme.colors.redPrimary,
							padding: 8,
							borderRadius: 8,
							flex: 1,
							marginLeft: 4,
							alignItems: "center",
						}}
					>
						<Iconify icon="material-symbols:close" size={20} color="white" />
					</TouchableOpacity>
				</View>
			) : (
				<TouchableOpacity
					onPress={handleSendRequest}
					style={{
						backgroundColor: theme.colors.primary,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						paddingVertical: 8,
						paddingHorizontal: 16,
						borderRadius: 8,
						marginTop: 8,
					}}
				>
					<Iconify icon="mdi:account-plus" size={18} color="white" />
					<Text style={{ color: "white", fontSize: 14, marginLeft: 6 }}>
						{t("add_friend")}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default Friend;
