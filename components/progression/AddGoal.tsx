import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalGoal from "./ModalAddGoal";

export default function AddGoal() {
	const { theme } = useContext(ThemeContext);
	const [visible, setVisible] = useState(false);

	const { width } = Dimensions.get("window");

	return (
		<View
			className="rounded-xl flex-1 my-1"
			style={{
				width: width,
			}}
		>
			<Pressable
				className="mx-auto flex items-center justify-start flex-row px-2 py-3 rounded-xl"
				style={{
					flex: 1,
					borderStyle: "dashed",
					borderRadius: 10,
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
					className="text-[16px] font-semibold"
				>
					Définir un objectif
				</Text>
				<Iconify
					icon="bi:arrow-right"
					size={20}
					color={theme.colors.primary}
					style={{ marginLeft: "auto" }}
				/>
			</Pressable>

			<ModalGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}
