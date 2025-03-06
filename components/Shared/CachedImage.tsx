import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Image, ActivityIndicator } from "react-native";
import { getCachedImage } from "@db/files";

interface CachedImageProps {
	imagePath: string;
	style?: object;
	placeholder?: React.ReactNode;
	[key: string]: any;
}

const CachedImage: React.FC<CachedImageProps> = React.memo(
	({ imagePath, style, placeholder, ...props }) => {
		const [localUri, setLocalUri] = useState<string | null>(null);
		const [loading, setLoading] = useState(true);

		const loadCachedImage = useCallback(async () => {
			try {
				const uri = await getCachedImage(imagePath);
				setLocalUri(uri);
			} catch (error) {
				console.error("Failed to load cached image:", error);
			} finally {
				setLoading(false);
			}
		}, [imagePath]);

		useEffect(() => {
			loadCachedImage();
		}, [loadCachedImage]);

		const source = useMemo(() => ({ uri: localUri || "" }), [localUri]);

		if (loading) {
			return placeholder || <ActivityIndicator size="small" color="#999" />;
		}

		if (!localUri) {
			return null;
		}

		return <Image source={source} style={style} {...props} />;
	}
);

export default CachedImage;
