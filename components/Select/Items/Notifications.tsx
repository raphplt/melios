import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import ToggleButton from "@components/Account/Switch";
import RowTitleCustom from "./RowTitleCustom";
import ModalReminder from "../Modals/ModalReminder";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Notifications({ setValue }: { setValue: any }) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);
	const [selectedMoment, setSelectedMoment] = useState({
		label: "5 minutes avant",
		value: 5,
	});
	const [isSwitchOn, setIsSwitchOn] = useState(false);

	const onChange = (label: string, value: number) => {
		setVisible(false);
		setSelectedMoment({ label, value });
		setValue("reminderMoment", value);
	};

	return (
		<>
			<RowTitleCustom title="RAPPEL" />

			<View
				className="rounded-lg px-4 py-4 mt-1 flex flex-row items-center justify-between h-fit w-full"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<View className="flex flex-row items-center px-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="mr-4 text-[16px]"
					>
						{t("remind_me")}
					</Text>

					<ToggleButton value={isSwitchOn} onToggle={setIsSwitchOn} />
				</View>
				<View className="flex flex-row items-center px-2">
					<Pressable
						style={{
							backgroundColor: isSwitchOn ? theme.colors.primary : theme.colors.border,
						}}
						className="rounded-lg py-2 px-4"
						onPress={() => isSwitchOn && setVisible(true)}
						disabled={!isSwitchOn}
					>
						<Text
							style={{
								color: isSwitchOn ? theme.colors.textSecondary : theme.colors.text,
							}}
							className="text-[14px]"
						>
							{selectedMoment.label}
						</Text>
					</Pressable>
				</View>
				<ModalReminder
					visible={visible}
					setVisible={setVisible}
					onChange={onChange}
				/>
			</View>
		</>
	);
}