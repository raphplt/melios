import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalAddGoal from "./ModalAddGoal";
import { useTranslation } from "react-i18next";

export default function AddGoal() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [visible, setVisible] = useState(false);

	const { width } = Dimensions.get("window");

	return (
		<View
			className="flex-1 my-2"
			style={{
				width: width,
			}}
		>
			<View
				style={{
					width: width * 0.95,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					borderColor: theme.colors.primary,
					borderWidth: 1,
					borderStyle: "dashed",
				}}
				className="mx-auto flex items-center justify-center flex-row px-2 py-1 h-14 rounded-xl"
			>
				<Pressable
					onPress={() => setVisible(true)}
					className="flex flex-row items-center justify-center w-full h-full"
				>
					<Text
						style={{
							color: theme.colors.primary,
						}}
						className="text-[14px] font-semibold mx-2"
					>
						{t("define_goal")}
					</Text>
					<Iconify
						icon="ic:baseline-plus"
						size={24}
						color={theme.colors.primary}
						style={{ marginLeft: "auto" }}
					/>
				</Pressable>
			</View>

			<ModalAddGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}
