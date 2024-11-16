import { View, Text, Pressable } from "react-native";
import ModalWrapper from "./ModalWrapper";
import { useTheme } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";

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
	];

	const handleSelectColor = (colorCode: string) => {
		setColor(colorCode);
		setVisible(false);
	};

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View>
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-xl leading-6 mb-3 font-semibold"
				>
					Couleur de l'habitude
				</Text>
				<View className="flex flex-row flex-wrap justify-between w-11/12 mx-auto">
					{colors.map((color) => (
						<Pressable
							key={color.name}
							onPress={() => handleSelectColor(color.code)}
							className="flex flex-col items-center justify-center my-3 px-3"
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
