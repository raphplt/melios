import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalHelp from "./ModalHelp";

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
						icon="mdi:clock-time-four-outline"
						color={theme.colors.text}
						size={22}
					/>
				);
			case "RAPPEL":
				return (
					<Iconify icon="mdi:bell-outline" color={theme.colors.text} size={22} />
				);
			case "RÉPÉTITION":
				return <Iconify icon="mdi:calendar" color={theme.colors.text} size={22} />;
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
		}
	};

	const [visible, setVisible] = useState(false);

	return (
		<>
			<View className="w-full flex flex-row items-center justify-between mt-5 mb-3">
				<View className="flex items-center justify-cente flex-row">
					{renderIcon()}
					<Text
						style={{
							color: theme.colors.text,
							// fontFamily: "BaskervilleBold",
						}}
						className="ml-2 text-lg font-medium"
					>
						{capitalizeFirstLetter(title)}
					</Text>
				</View>
				<Pressable onPress={() => setVisible(true)}>
					<Iconify
						icon="material-symbols:info-outline"
						color={theme.colors.text}
						size={22}
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
