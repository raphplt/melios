import React from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import RowTitleCustom from "./RowTitleCustom";

type ConfidentialitySelectorProps = {
	value: "public" | "private" | "friends";
	onChange: (value: "public" | "private" | "friends") => void;
};

const ConfidentialitySelectorHabit: React.FC<ConfidentialitySelectorProps> = ({
	value,
	onChange,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const options = [
		{ label: t("public"), value: "public" },
		{ label: t("private"), value: "private" },
		{ label: t("friends"), value: "friends" },
	];

	return (
		<>
			<RowTitleCustom title="CONFIDENTIALITÉ" />

			<View
				className="rounded-xl px-4 py-3 mt-1 flex flex-row items-center justify-between h-fit"
				style={{
					backgroundColor: theme.colors.cardBackground,
					shadowColor: theme.colors.textTertiary,
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.25,
					shadowRadius: 4,
					elevation: 3,
				}}
			>
				{options.map((option) => (
					<Pressable
						key={option.value}
						style={{
							backgroundColor:
								value === option.value
									? theme.colors.primary
									: theme.colors.grayPrimary,
						}}
						className="rounded-xl py-2 px-4 mx-1"
						onPress={() => onChange(option.value as "public" | "private" | "friends")}
					>
						<Text
							style={{
								color: "white",
							}}
							className="text-[14px]"
						>
							{option.label}
						</Text>
					</Pressable>
				))}
			</View>
		</>
	);
};

export default ConfidentialitySelectorHabit;
