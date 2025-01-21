import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";

type ConfidentialityFilterProps = {
	confidentiality: string;
	setConfidentiality: (value: string) => void;
};

const ConfidentialityFilter: React.FC<ConfidentialityFilterProps> = ({
	confidentiality,
	setConfidentiality,
}) => {
	const { theme } = useTheme();

	return (
		<View
			className="flex flex-row items-center justify-start gap-2 rounded-2xl"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<TouchableOpacity
				onPress={() => setConfidentiality("public")}
				style={{
					backgroundColor:
						confidentiality === "public"
							? theme.colors.yellowPrimary
							: theme.colors.cardBackground,
				}}
				className="px-3 py-1 rounded-2xl"
			>
				<Iconify
					icon="mynaui:globe"
					size={24}
					color={
						confidentiality === "public"
							? theme.colors.textSecondary
							: theme.colors.textTertiary
					}
				/>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setConfidentiality("friends")}
				style={{
					backgroundColor:
						confidentiality === "friends"
							? theme.colors.yellowPrimary
							: theme.colors.cardBackground,
				}}
				className="px-3 py-1 rounded-2xl"
			>
				<Iconify
					icon="ion:people"
					size={24}
					color={
						confidentiality === "friends"
							? theme.colors.primary
							: theme.colors.textTertiary
					}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default ConfidentialityFilter;
