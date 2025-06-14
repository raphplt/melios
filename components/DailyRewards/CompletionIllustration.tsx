import React from "react";
import { View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import CachedImage from "@components/Shared/CachedImage";
import { LinearGradient } from "expo-linear-gradient";

interface CompletionIllustrationProps {
	rewardClaimed: boolean;
}

const CompletionIllustration: React.FC<CompletionIllustrationProps> = ({
	rewardClaimed,
}) => {
	const { theme } = useTheme();

	if (!rewardClaimed) return null;

	return (
		<View className="items-center py-8">
			<LinearGradient
				colors={[
					theme.colors.primary + "10",
					theme.colors.primary + "05",
					"transparent",
				]}
				className="w-full items-center py-8 rounded-3xl mx-4"
			>
				<CachedImage
					imagePath="images/illustrations/character2.png"
					style={{
						width: 200,
						height: 200,
						marginBottom: 16,
					}}
				/>
			</LinearGradient>
		</View>
	);
};

export default CompletionIllustration;
