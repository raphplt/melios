import React, { useEffect, useState } from "react";
import { Text, View, Pressable, ActivityIndicator } from "react-native";
import CachedImage from "@components/Shared/CachedImage";
import { useTheme } from "@context/ThemeContext";
import { Member } from "@type/member";
import {
	sendFriendRequest,
	acceptFriendRequest,
	declineFriendRequest,
} from "@db/member";
import getIcon from "@utils/cosmeticsUtils";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";

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
		const loadProfilePicture = () => {
			if (member?.profilePicture) {
				const uri = getIcon(member.profilePicture);
				setProfilePictureUri(uri);
			}
		};
		loadProfilePicture();
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
			className="flex flex-col items-center justify-between w-[47%] p-2 my-2 rounded-lg mx-auto"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
		>
			<CachedImage
				imagePath={profilePictureUri || "images/cosmetics/man.png"}
				style={{ width: 60, height: 60, marginTop: 5 }}
			/>
			<Text className="text-center text-[14px] font-bold mt-1">{member.nom}</Text>
			{loading ? (
				<ActivityIndicator size="small" color={theme.colors.primary} />
			) : isFriend ? (
				<Text>{t("already_friend")}</Text>
			) : requestSent ? (
				<Text>{t("request_sent")}</Text>
			) : requestReceived ? (
				<>
					<Pressable
						onPress={handleAcceptRequest}
						style={{ backgroundColor: theme.colors.primary }}
						className="p-2 rounded-lg mt-2"
					>
						<Text style={{ color: "white" }}>{t("accept")}</Text>
					</Pressable>
					<Pressable
						onPress={handleDeclineRequest}
						style={{ backgroundColor: theme.colors.primary }}
						className="p-2 rounded-lg mt-2"
					>
						<Text style={{ color: "white" }}>{t("decline")}</Text>
					</Pressable>
				</>
			) : (
				<Pressable
					onPress={handleSendRequest}
					style={{ backgroundColor: theme.colors.primary }}
					className="p-2 rounded-lg mt-2"
				>
					<Text style={{ color: "white" }}>{t("add_friend")}</Text>
				</Pressable>
			)}
		</View>
	);
};

export default Friend;
