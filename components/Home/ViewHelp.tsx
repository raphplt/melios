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
					colors={[theme.colors.backgroundTertiary, theme.colors.purpleSecondary]}
					style={{
						borderRadius: 10,
						padding: 10,
						margin: 10,
						marginTop: 20,
						marginBottom: 20,
					}}
					start={[0, 0]}
					className="w-11/12 mx-auto my-1 py-8 "
				>
					<Pressable
						className="w-full flex flex-row items-center justify-between"
						onPress={() => setShowModal(true)}
					>
						<View>
							<Text
								style={{
									color: theme.colors.text,
									fontFamily: "BaskervilleBold",
								}}
								className="text-lg font-semibold"
							>
								{t("need_help")}
							</Text>
							<View className="flex flex-row items-center justify-between mt-2">
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
						<Iconify icon="mdi:chevron-right" size={40} color={theme.colors.text} />
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