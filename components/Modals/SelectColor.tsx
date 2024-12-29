import { View, Text, Pressable } from "react-native";
import ModalWrapper from "./ModalWrapper";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import { useTranslation } from "react-i18next";

export default function SelectColor({
	visible,
	setVisible,
	setColor,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	setColor: (color: string) => void;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const colors = [
		{ name: "Color 1", code: "#f1a025" },
		{ name: "Color 2", code: "#C95355" },
		{ name: "Color 3", code: "#965BD7" },
		{ name: "Color 4", code: "#499DBD" },
		{ name: "Color 5", code: "#47A86C" },
		{ name: "Color 6", code: "#FFB347" },
		{ name: "Color 7", code: "#FF6961" },
		{ name: "Color 8", code: "#B19CD9" },
		{ name: "Color 9", code: "#77DD77" },
		{ name: "Color 10", code: "#AEC6CF" },
		{ name: "Color 11", code: "#FDFD96" },
		{ name: "Color 12", code: "#CBAACB" },
		{ name: "Color 13", code: "#6495ED" },
		{ name: "Color 14", code: "#FF69B4" },
		{ name: "Color 15", code: "#FFA07A" },
	];

	const handleSelectColor = (colorCode: string) => {
		setColor(colorCode);
		setVisible(false);
	};

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-center w-[80vw]">
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-xl leading-6 mb-3 font-semibold"
				>
					{t("color_habit")}
				</Text>
				<View className="flex flex-row flex-wrap justify-center w-full mx-auto">
					{colors.map((color) => (
						<Pressable
							key={color.name}
							onPress={() => handleSelectColor(color.code)}
							className="flex flex-col items-center justify-center my-3 px-4"
						>
							<View
								style={{
									backgroundColor: color.code,
									borderColor: theme.colors.text,
									borderWidth: 1,
								}}
								className="w-10 h-10 rounded-full"
							/>
						</Pressable>
					))}
				</View>
			</View>
		</ModalWrapper>
	);
}
