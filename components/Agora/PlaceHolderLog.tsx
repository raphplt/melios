import { useTheme } from "@context/ThemeContext";
import React from "react";
import { Dimensions, View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

const PlaceHolderLog = () => {
	const screen = Dimensions.get("screen");
	const { theme } = useTheme();

	return (
		<View
			style={{
				width: screen.width - 24,
				padding: 12, // Réduction du padding
				borderRadius: 10, // Légère réduction du rayon des bords
				backgroundColor: theme.colors.cardBackground,
				marginBottom: 12, // Espacement inférieur ajusté
				shadowColor: theme.colors.border,
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			}}
		>
			{/* Header avec image de profil et nom */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					marginBottom: 10, // Réduction de l'espacement
				}}
			>
				<ShimmerPlaceholder
					width={32} // Réduction de la taille
					height={32}
					style={{ borderRadius: 16, marginRight: 10 }}
				/>
				<ShimmerPlaceholder width={120} height={16} style={{ borderRadius: 4 }} />
			</View>

			{/* Nom de l'habitude */}
			<ShimmerPlaceholder
				width={screen.width - 120} // Réduction de la largeur
				height={20} // Réduction de la hauteur
				style={{
					borderRadius: 5,
					marginBottom: 12, // Réduction de l'espacement
					alignSelf: "center",
				}}
			/>

			{/* Icône de l'habitude */}
			<View style={{ alignItems: "center", marginBottom: 12 }}>
				<ShimmerPlaceholder
					width={36} // Réduction de la taille
					height={36}
					style={{
						borderRadius: 18,
					}}
				/>
			</View>

			{/* Footer avec date et réactions */}
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<ShimmerPlaceholder width={80} height={16} style={{ borderRadius: 4 }} />
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<ShimmerPlaceholder
						width={20} // Réduction de la taille
						height={20}
						style={{ borderRadius: 10, marginRight: 6 }}
					/>
					<ShimmerPlaceholder width={48} height={16} style={{ borderRadius: 4 }} />
				</View>
			</View>
		</View>
	);
};

export default PlaceHolderLog;
