import React, { useState } from "react";
import { View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { updateMemberField } from "@db/member";

type Confidentialities = "public" | "private" | "friends";

const ConfidentialitySelector = () => {
	const { member, setMember } = useData();
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

	return (
		<View>
			<Dropdown
				labelField="label"
				valueField="value"
				onChange={(item) => changeConfidentiality(item.value as Confidentialities)}
				value={selectedConfidentiality}
				data={[
					{ label: t("public"), value: "public" },
					{ label: t("private"), value: "private" },
					{ label: t("friends"), value: "friends" },
				]}
				style={{
					borderRadius: 10,
					width: 120,
				}}
			/>
		</View>
	);
};

export default ConfidentialitySelector;
