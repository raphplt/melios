import ModalWrapper from "@components/Modals/ModalWrapper";
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { View, Text } from "react-native";

const ModalHelp = ({
	visible,
	setVisible,
	title,
	text,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	title: string;
	text: string;
}) => {
	const { theme } = useTheme();
	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-start justify-start w-11/12 mx-auto">
				<Text
					className="text-lg font-semibold"
					style={{
						color: theme.colors.text,
					}}
				>
					{title}
				</Text>
				<Text
					className="mt-2 text-[16px]"
					style={{
						color: theme.colors.textTertiary,
					}}
				>
					{text}
				</Text>
			</View>
		</ModalWrapper>
	);
};

export default ModalHelp;
