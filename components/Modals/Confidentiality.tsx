import React, { useEffect, useState } from "react";
import ModalWrapper from "./ModalWrapper";
import { Text, View, TouchableOpacity } from "react-native";
import { useData } from "@context/DataContext";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import { updateMemberField } from "@db/member";
import { Iconify } from "react-native-iconify";

type Confidentialities = "public" | "private" | "friends";

const Confidentiality = () => {
	const { member, setMember } = useData();
	const { t } = useTranslation();
	const { theme } = useTheme();

	const [visible, setVisible] = useState<boolean>(false);
	const [selectedConfidentiality, setSelectedConfidentiality] =
		useState<Confidentialities>(member?.activityConfidentiality || "private");

	useEffect(() => {
		if (!member?.activityConfidentiality) {
			console.log("Confidentiality.tsx: activityConfidentiality is not set");
			setVisible(true);
		}
	}, [member]);

	const changeConfidentiality = async (confidentiality: Confidentialities) => {
		setSelectedConfidentiality(confidentiality);
		if (member) {
			setMember({ ...member, activityConfidentiality: confidentiality });
			await updateMemberField("activityConfidentiality", confidentiality);
		}
		setVisible(false);
	};

	const renderIcon = (confidentiality: Confidentialities) => {
		switch (confidentiality) {
			case "public":
				return (
					<Iconify
						icon="material-symbols:public"
						size={20}
						color={theme.colors.text}
					/>
				);
			case "private":
				return <Iconify icon="mdi:lock" size={20} color={theme.colors.text} />;
			case "friends":
				return (
					<Iconify icon="mdi:account-group" size={20} color={theme.colors.text} />
				);
		}
	};

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-lg font-bold"
			>
				{t("manage_confidentiality_habits")}
			</Text>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-[14px] my-2 py-4"
			>
				{t("manage_confidentiality_habits_description")}
			</Text>
			<View>
				{["public", "private", "friends"].map((confidentiality) => (
					<TouchableOpacity
						key={confidentiality}
						onPress={() =>
							changeConfidentiality(confidentiality as Confidentialities)
						}
						style={{
							flexDirection: "row",
							alignItems: "center",
							marginVertical: 5,
						}}
					>
						<View
							style={{
								height: 20,
								width: 20,
								borderRadius: 10,
								borderWidth: 1,
								borderColor: theme.colors.primary,
								alignItems: "center",
								justifyContent: "center",
								marginRight: 10,
							}}
						>
							{selectedConfidentiality === confidentiality && (
								<View
									style={{
										height: 10,
										width: 10,
										borderRadius: 5,
										backgroundColor: theme.colors.primary,
									}}
								/>
							)}
						</View>
						{renderIcon(confidentiality as Confidentialities)}
						<Text
							style={{ color: theme.colors.text }}
							className="text-lg font-semibold ml-2"
						>
							{t(confidentiality)}
						</Text>
					</TouchableOpacity>
				))}
			</View>
		</ModalWrapper>
	);
};

export default Confidentiality;
