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
import { Iconify } from "react-native-iconify";

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
			<Text
				className="text-center text-[14px] font-bold mt-1 py-1"
				style={{
					color: theme.colors.text,
				}}
			>
				{member.nom}
			</Text>
			{loading ? (
				<ActivityIndicator size="small" color={theme.colors.primary} />
			) : isFriend ? null : requestSent ? (
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-center mt-1"
				>
					{t("request_sent")}
				</Text>
			) : requestReceived ? (
				<View className="flex flex-row items-center justify-evenly w-full py-1">
					<Pressable
						onPress={handleAcceptRequest}
						style={{ backgroundColor: theme.colors.primary }}
						className="p-2 rounded-lg mt-2"
					>
						<Iconify icon="material-symbols:done" size={20} color="white" />
					</Pressable>
					<Pressable
						onPress={handleDeclineRequest}
						style={{ backgroundColor: theme.colors.redPrimary }}
						className="p-2 rounded-lg mt-2"
					>
						<Iconify icon="material-symbols:close" size={20} color="white" />
					</Pressable>
				</View>
			) : (
				<Pressable
					onPress={handleSendRequest}
					style={{ backgroundColor: theme.colors.primary }}
					className="py-[6px] px-3 rounded-lg mt-2 flex flex-row items-center justify-center"
				>
					<Iconify icon="mdi:account-plus" size={18} color="white" />

					<Text style={{ color: "white" }} className="text-center ml-2 text-sm">
						{t("add_friend")}
					</Text>
				</Pressable>
			)}
		</View>
	);
};

export default Friend;
