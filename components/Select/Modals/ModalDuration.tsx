import { useTheme } from "@context/ThemeContext";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import WheelPicker from "react-native-wheely";
import { useTranslation } from "react-i18next";
import ModalWrapperSimple from "@components/Modals/ModalWrapperSimple";

export default function ModalDuration({
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

	const [selectedMinutes, setSelectedMinutes] = useState(5);

	const generateDurationOptions = () => {
		const options = [];
		for (let i = 0; i <= 120; i += 5) {
			const label = `${i} minute${i > 1 ? "s" : ""}`;
			options.push({ label, value: i });
		}
		return options;
	};

	const durations = generateDurationOptions();

	const handleOkPress = () => {
		const label = `${selectedMinutes} minute ${selectedMinutes > 1 ? "s" : ""}`;
		onChange(label, selectedMinutes);
		setVisible(false);
	};

	return (
		<ModalWrapperSimple visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-center w-[80vw]">
				<View className=" flex flex-row items-center justify-between w-11/12 ">
					<Text
						className="text-lg"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{t("duration")}
					</Text>
				</View>
				<View className="w-full">
					<WheelPicker
						options={durations.map((duration) => duration.label)}
						selectedIndex={durations.findIndex(
							(duration) => duration.value === selectedMinutes
						)}
						onChange={(index) => setSelectedMinutes(durations[index].value)}
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
