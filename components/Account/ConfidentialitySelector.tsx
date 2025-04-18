import React, { useEffect, useState } from "react";
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
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member, setMember } = useData();
	const [visible, setVisible] = useState(false);
	const [selectedConfidentiality, setSelectedConfidentiality] =
		useState<Confidentialities>("private");

	useEffect(() => {
		if (member) {
			setSelectedConfidentiality(member.activityConfidentiality || "private");
		}
	}, [member]);

	const values = [
		{ label: t("public"), value: "public", icon: "material-symbols:globe" },
		{ label: t("private"), value: "private", icon: "material-symbols:lock" },
		{ label: t("friends"), value: "friends", icon: "material-symbols:groups" },
	];

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

	const renderIcon = (value: Confidentialities) => {
		switch (value) {
			case "public":
				return (
					<Iconify
						icon="material-symbols:globe"
						size={24}
						color={theme.colors.primary}
					/>
				);
			case "private":
				return (
					<Iconify
						icon="material-symbols:lock"
						size={24}
						color={theme.colors.primary}
					/>
				);
			case "friends":
				return (
					<Iconify
						icon="material-symbols:groups"
						size={24}
						color={theme.colors.primary}
					/>
				);
		}
	};

	return (
		<View>
			<Pressable onPress={handleOpen}>
				<View className="flex-row items-center">
					<Text
						className="mr-2 font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						{t(selectedConfidentiality)}
					</Text>
					{renderIcon(selectedConfidentiality)}
				</View>
			</Pressable>

			<BottomSlideModal
				visible={visible}
				setVisible={handleClose}
				title={t("select_confidentiality_text")}
			>
				<FlatList
					data={values}
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
							className="flex-row items-center rounded-xl py-4"
						>
							{renderIcon(item.value as Confidentialities)}
							<Text
								style={{
									color:
										selectedConfidentiality === item.value
											? theme.colors.textSecondary
											: theme.colors.textTertiary,
								}}
								className="ml-3 font-semibold"
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
