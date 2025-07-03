import React, { useEffect, useState } from "react";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";
import CachedImage from "./CachedImage";

export interface UserBadgeProps {
	width?: number;
	height?: number;
	customProfilePicture?: string;
	customImage?: string;
	style?: object;
}

const UserBadge = ({
	width = 24,
	height = 24,
	customProfilePicture = "",
	customImage = "",
	style,
}: UserBadgeProps) => {
	const { member } = useData();

	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	useEffect(() => {
		const loadProfilePicture = () => {
			if (customProfilePicture) {
				// Si c'est une URL complète (Firebase, etc.), l'utiliser directement
				if (
					customProfilePicture.startsWith("http") ||
					customProfilePicture.startsWith("gs://")
				) {
					setProfilePictureUri(customProfilePicture);
				} else {
					// Sinon, utiliser la fonction getIcon pour les avatars locaux
					const uri = getIcon(customProfilePicture);
					setProfilePictureUri(uri);
				}
				return;
			}
			if (member?.profilePicture) {
				// Si c'est une URL complète (Firebase, etc.), l'utiliser directement
				if (
					member.profilePicture.startsWith("http") ||
					member.profilePicture.startsWith("gs://")
				) {
					setProfilePictureUri(member.profilePicture);
				} else {
					// Sinon, utiliser la fonction getIcon pour les avatars locaux
					const uri = getIcon(member.profilePicture);
					setProfilePictureUri(uri);
				}
			}
		};
		loadProfilePicture();
	}, [member, customProfilePicture]);

	return (
		<CachedImage
			imagePath={customImage || profilePictureUri || "images/cosmetics/man.png"}
			style={{ width: width, height: height, ...style }}
			className="rounded-full bg-gray-600"
		/>
	);
};

export default UserBadge;
