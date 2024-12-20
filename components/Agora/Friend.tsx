import React, { useEffect, useState } from "react";
import { Text, View, Button, ActivityIndicator } from "react-native";
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

type Props = {
	member: Member;
};

const Friend = ({ member }: Props) => {
	const { theme } = useTheme();
	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);
	const [loading, setLoading] = useState(false);

	const { member: currentUser } = useData();

	if (!currentUser) return null;

	const isFriend = (currentUser.friends ?? []).includes(member.uid);
	const requestSent =
		currentUser.friendRequestsSent?.includes(member.uid) ?? false;
	const requestReceived =
		currentUser.friendRequestsReceived?.includes(member.uid) ?? false;

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
			await sendFriendRequest(member.uid);
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
		} catch (error) {
			console.error("Erreur lors du refus de la demande :", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<View
			className="flex flex-col items-center justify-between w-[45%] p-2 my-2 rounded-lg mx-auto"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
			key={member.uid}
		>
			<CachedImage
				imagePath={profilePictureUri || "images/cosmetics/man.png"}
				style={{ width: 60, height: 60, marginTop: 5 }}
			/>
			<Text className="text-center text-[14px] font-bold mt-1">{member.nom}</Text>
			{loading ? (
				<ActivityIndicator size="small" color={theme.colors.primary} />
			) : isFriend ? (
				<Text>Déjà ami</Text>
			) : requestSent ? (
				<Text>Demande envoyée</Text>
			) : requestReceived ? (
				<>
					<Button title="Accepter" onPress={handleAcceptRequest} />
					<Button title="Refuser" onPress={handleDeclineRequest} color="red" />
				</>
			) : (
				<Button title="Ajouter" onPress={handleSendRequest} />
			)}
		</View>
	);
};

export default Friend;
