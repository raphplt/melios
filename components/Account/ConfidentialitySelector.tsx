import React, { useState } from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { updateMemberField } from "@db/member";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

type Confidentialities = "public" | "private" | "friends";

const ConfidentialitySelector = () => {
	const { member, setMember } = useData();
	const { theme } = useTheme();
	const [selectedConfidentiality, setSelectedConfidentiality] =
		useState<Confidentialities>(member?.activityConfidentiality || "private");
	const { t } = useTranslation();

	const changeConfidentiality = async (confidentiality: Confidentialities) => {
		setSelectedConfidentiality(confidentiality);
		if (member) {
			setMember({ ...member, activityConfidentiality: confidentiality });
			await updateMemberField("activityConfidentiality", confidentiality);
		}
	};

	const renderIcon = (name: string) => {
		switch (name) {
			case "public":
				return (
					<Iconify
						icon="mynaui:globe"
						size={18}
						color={
							selectedConfidentiality === "public"
								? theme.colors.textSecondary
								: theme.colors.textTertiary
						}
					/>
				);
			case "private":
				return (
					<Iconify
						icon="material-symbols:lock"
						size={18}
						color={
							selectedConfidentiality === "private"
								? theme.colors.textSecondary
								: theme.colors.textTertiary
						}
					/>
				);
			case "friends":
				return (
					<Iconify
						icon="ion:people"
						size={18}
						color={
							selectedConfidentiality === "friends"
								? theme.colors.textSecondary
								: theme.colors.textTertiary
						}
					/>
				);
		}
	};

	return (
		<View>
			<Dropdown
				labelField="label"
				valueField="value"
				onChange={(item) => changeConfidentiality(item.value as Confidentialities)}
				value={selectedConfidentiality}
				renderItem={(item, selected) => (
					<View
						style={{
							padding: 10,
							backgroundColor: selected
								? theme.colors.primary
								: theme.colors.background,
						}}
						className="flex-row items-center"
					>
						{renderIcon(item.value)}
						<Text
							style={{
								color: selected
									? theme.colors.textSecondary
									: theme.colors.textTertiary,
							}}
							className="text-sm ml-2"
						>
							{item.label}
						</Text>
					</View>
				)}
				data={[
					{ label: t("public"), value: "public" },
					{ label: t("private"), value: "private" },
					{ label: t("friends"), value: "friends" },
				]}
				style={{
					borderRadius: 10,
					width: 110,
				}}
				containerStyle={{
					borderRadius: 5,
				}}
				iconColor={theme.colors.textTertiary}
			/>
		</View>
	);
};

export default ConfidentialitySelector;
