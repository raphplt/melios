import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalAddGoal from "./ModalAddGoal";

export default function AddGoal() {
	const { theme } = useContext(ThemeContext);
	const [visible, setVisible] = useState(false);

	const { width } = Dimensions.get("window");

	return (
		<View
			className="flex-1 my-2"
			style={{
				width: width,
			}}
		>
			<Pressable
				className="mx-auto flex items-center justify-start flex-row px-2 py-1"
				style={{
					flexGrow: 1,
					borderStyle: "dashed",
					borderRadius: 16,
					borderWidth: 2,
					borderColor: theme.colors.primary,
					width: width * 0.95,
				}}
				onPress={() => setVisible(true)}
			>
				<Text
					style={{
						color: theme.colors.primary,
					}}
					className="text-[16px] font-semibold mx-2"
				>
					Définir un objectif
				</Text>
				<Iconify
					icon="bi:arrow-right"
					size={24}
					color={theme.colors.primary}
					style={{ marginLeft: "auto" }}
				/>
			</Pressable>

			<ModalAddGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}