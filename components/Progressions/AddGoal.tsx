import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalAddGoal from "./ModalAddGoal";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

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
			<BlurView
				intensity={100}
				tint={theme.dark ? "dark" : "light"}
				style={{
					width: width * 0.95,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
				}}
				className="mx-auto flex items-center justify-center flex-row px-2 py-1 h-14 rounded-xl overflow-hidden"
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
			</BlurView>

			<ModalAddGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}
