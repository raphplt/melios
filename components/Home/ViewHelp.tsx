import HelpModal from "@components/Modals/HelpModal";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

export default function ViewHelp() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<ZoomableView>
				<LinearGradient
					colors={[theme.colors.greenSecondary, theme.colors.backgroundSecondary]}
					style={{
						borderRadius: 8,
						padding: 10,
						margin: 10,
						marginTop: 10,
						marginBottom: 10,
					}}
					start={[0, 0]}
					className="w-[95%] mx-auto py-8 "
				>
					<Pressable
						className="w-full flex flex-row items-center justify-between"
						onPress={() => setShowModal(true)}
					>
						<View className="ml-2">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-xl font-semibold"
							>
								{t("need_help")}
							</Text>
							<View className="flex flex-row items-center justify-between mt-1">
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[14px] font-normal mr-2"
								>
									{t("look_tutorial_again")}
								</Text>
							</View>
						</View>
						<Iconify
							icon="solar:help-linear"
							size={36}
							color={theme.colors.textTertiary}
						/>
					</Pressable>
				</LinearGradient>
			</ZoomableView>
			<HelpModal
				visible={showModal}
				setVisible={setShowModal}
				onClose={() => setShowModal(false)}
			/>
		</>
	);
}