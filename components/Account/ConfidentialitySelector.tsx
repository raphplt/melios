import React, { useState } from "react";
import {
	FlatList,
	Pressable,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { updateMemberField } from "@db/member";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import BottomSlideModal from "@components/Modals/ModalBottom";

type Confidentialities = "public" | "private" | "friends";

const ConfidentialitySelector = () => {
	const { member, setMember } = useData();
	const { theme } = useTheme();
	const [selectedConfidentiality, setSelectedConfidentiality] =
		useState<Confidentialities>(member?.activityConfidentiality || "private");
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	const changeConfidentiality = async (confidentiality: Confidentialities) => {
		setSelectedConfidentiality(confidentiality);
		if (member) {
			setMember({ ...member, activityConfidentiality: confidentiality });
			await updateMemberField("activityConfidentiality", confidentiality);
		}
		handleClose();
	};

	const handleOpen = () => {
		setVisible(true);
	};

	const handleClose = () => {
		setVisible(false);
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
								? theme.colors.text
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
								? theme.colors.text
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
								? theme.colors.text
								: theme.colors.textTertiary
						}
					/>
				);
		}
	};

	return (
		<View>
			<Pressable onPress={handleOpen}>
				<View className="flex-row items-center">
					{renderIcon(selectedConfidentiality)}
					<Text
						className="ml-2"
						style={{
							color: theme.colors.text,
						}}
					>
						{t(selectedConfidentiality)}
					</Text>
				</View>
			</Pressable>

			<BottomSlideModal visible={visible} setVisible={handleClose}>
				<FlatList
					ListHeaderComponent={
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-lg font-semibold mb-4"
						>
							{t("select_confidentiality_text")}
						</Text>
					}
					data={[
						{ label: t("public"), value: "public" },
						{ label: t("private"), value: "private" },
						{ label: t("friends"), value: "friends" },
					]}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() => changeConfidentiality(item.value as Confidentialities)}
							style={{
								padding: 10,
								backgroundColor:
									selectedConfidentiality === item.value
										? theme.colors.primary
										: "transparent",
							}}
							className="flex-row items-center rounded-xl py-5"
						>
							{renderIcon(item.value)}
							<Text
								style={{
									color:
										selectedConfidentiality === item.value
											? theme.colors.text
											: theme.colors.textTertiary,
								}}
								className="ml-4 font-semibold"
							>
								{item.label}
							</Text>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.value}
				/>
			</BottomSlideModal>
		</View>
	);
};

export default ConfidentialitySelector;
