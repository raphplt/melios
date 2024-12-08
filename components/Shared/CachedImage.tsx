import { getCachedImage } from "@db/files";
import React, { useState, useEffect } from "react";
import { Image, ActivityIndicator } from "react-native";

interface CachedImageProps {
	imagePath: string;
	style?: object;
	placeholder?: React.ReactNode;
	[key: string]: any;
}

const CachedImage: React.FC<CachedImageProps> = ({
	imagePath,
	style,
	placeholder,
	...props
}) => {
	const [localUri, setLocalUri] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadCachedImage = async () => {
			try {
				const uri = await getCachedImage(imagePath);
				setLocalUri(uri);
			} catch (error) {
				console.error("Failed to load cached image:", error);
			} finally {
				setLoading(false);
			}
		};

		loadCachedImage();
	}, [imagePath]);

	if (loading) {
		return placeholder || <ActivityIndicator size="small" color="#999" />;
	}

	if (!localUri) {
		return null;
	}

	return <Image source={{ uri: localUri }} style={style} {...props} />;
};

export default CachedImage;
