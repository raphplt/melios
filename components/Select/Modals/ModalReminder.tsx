import ModalWrapper from "@components/Modals/ModalWrapper";
import { useTheme } from "@context/ThemeContext";
import React, { useState } from "react";
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
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-center">
				<View className="flex flex-row justify-between w-10/12 items-center">
					<Text
						className="text-lg"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						Rappel
					</Text>
					<Pressable onPress={handleOkPress}>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-lg"
						>
							OK
						</Text>
					</Pressable>
				</View>
				<View className="w-full">
					<WheelPicker
						selectedIndex={selectedIndex}
						options={moments.map((moment) => moment.label)}
						onChange={(index) => setSelectedIndex(index)}
					/>
				</View>
			</View>
		</ModalWrapper>
	);
}
