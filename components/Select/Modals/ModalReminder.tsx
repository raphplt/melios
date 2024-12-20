import ModalWrapperSimple from "@components/Modals/ModalWrapperSimple";
import { useTheme } from "@context/ThemeContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import WheelPicker from "react-native-wheely";

export default function ModalReminder({
	visible,
	setVisible,
	onChange,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onChange: (label: string, value: number) => void;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const moments = [
		{ label: "5 minutes avant", value: 5 },
		{ label: "10 minutes avant", value: 10 },
		{ label: "15 minutes avant", value: 15 },
		{ label: "30 minutes avant", value: 30 },
		{ label: "1 heure avant", value: 60 },
		{ label: "2 heures avant", value: 120 },
	];

	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleOkPress = () => {
		const selectedMoment = moments[selectedIndex];
		onChange(selectedMoment.label, selectedMoment.value);
		setVisible(false);
	};

	return (
		<ModalWrapperSimple visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-center w-[80vw]">
				<View className="flex flex-row justify-between w-10/12 items-center">
					<Text
						className="text-lg"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{t("remind_me")}
					</Text>
				</View>
				<View className="w-full">
					<WheelPicker
						selectedIndex={selectedIndex}
						options={moments.map((moment) => moment.label)}
						onChange={(index) => setSelectedIndex(index)}
					/>
				</View>

				<Pressable
					onPress={handleOkPress}
					style={{
						backgroundColor: theme.colors.primary,
					}}
					className="rounded-2xl p-3 w-full flex mt-3 items-center"
				>
					<Text
						style={{
							color: theme.colors.textSecondary,
						}}
						className="text-lg"
					>
						OK
					</Text>
				</Pressable>
			</View>
		</ModalWrapperSimple>
	);
}
