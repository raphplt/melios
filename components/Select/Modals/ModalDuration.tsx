import ModalWrapper from "@components/Modals/ModalWrapper";
import { useTheme } from "@context/ThemeContext";
import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import WheelPicker from "react-native-wheely";

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

	const generateDurations = () => {
		const durations = [];
		for (let i = 0; i <= 90; i += 5) {
			const label = i === 0 ? "0 minute" : `${i} minutes`;
			durations.push({ label, value: i });
		}
		return durations;
	};

	const durations = generateDurations();

	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleOkPress = () => {
		const selectedDuration = durations[selectedIndex];
		onChange(selectedDuration.label, selectedDuration.value);
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
						Durée
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
						options={durations.map((duration) => duration.label)}
						onChange={(index) => setSelectedIndex(index)}
					/>
				</View>
			</View>
		</ModalWrapper>
	);
}
