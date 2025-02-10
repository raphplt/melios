import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalHelp from "./ModalHelp";
import React from "react";

const capitalizeFirstLetter = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export default function RowTitleCustom({ title }: { title: string }) {
	const { theme } = useTheme();

	const renderIcon = () => {
		switch (title) {
			case "MOMENT":
				return (
					<Iconify
						icon="tabler:clock-hour-3"
						color={theme.colors.textTertiary}
						size={20}
					/>
				);
			case "RAPPEL":
				return (
					<Iconify icon="mdi:bell-outline" color={theme.colors.textTertiary} size={20} />
				);
			case "RÉPÉTITION":
				return (
					<Iconify
						icon="material-symbols:repeat"
						color={theme.colors.textTertiary}
						size={20}
					/>
				);
			case "CONFIDENTIALITÉ":
				return (
					<Iconify
						icon="material-symbols:group-outline-rounded"
						color={theme.colors.textTertiary}
						size={20}
					/>
				);
		}
	};

	const helpText = () => {
		switch (title) {
			case "MOMENT":
				return "Sélectionnez le moment de la journée où vous souhaitez effectuer votre habitude.";
			case "RAPPEL":
				return "Sélectionnez le moment où vous souhaitez être rappelé de votre habitude.";
			case "RÉPÉTITION":
				return "Sélectionnez la fréquence à laquelle vous souhaitez effectuer votre habitude.";
			case "CONFIDENTIALITÉ":
				return "Sélectionnez qui pourra voir votre habitude dans l'Agora.";
		}
	};

	const [visible, setVisible] = useState(false);

	return (
		<>
			<View className="w-full flex flex-row items-center justify-between mt-5 mb-1">
				<View className="flex items-center justify-cente flex-row gap-1">
					{renderIcon()}
					<Text
						style={{
							color: theme.colors.textTertiary,
						}}
						className="ml-1 text-md font-medium"
					>
						{capitalizeFirstLetter(title)}
					</Text>
				</View>
				<Pressable onPress={() => setVisible(true)}>
					<Iconify
						icon="material-symbols:info-outline"
						color={theme.colors.textTertiary}
						size={18}
					/>
				</Pressable>
			</View>
			<ModalHelp
				visible={visible}
				setVisible={setVisible}
				title={capitalizeFirstLetter(title)}
				text={`${helpText()}`}
			/>
		</>
	);
}
