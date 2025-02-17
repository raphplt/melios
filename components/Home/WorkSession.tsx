import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

const WorkSession = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	return (
		<ZoomableView>
			<LinearGradient
				colors={[theme.colors.backgroundTertiary, theme.colors.purpleSecondary]}
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
					// onPress={() => setShowModal(true)}
				>
					<View className="ml-2">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-xl font-semibold"
						>
							{t("session_work")}
						</Text>
						<View className="flex flex-row items-center justify-between mt-1">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[14px] font-normal mr-2"
							>
								{t("start_a_work_session")}
							</Text>
						</View>
					</View>
					<Iconify
						icon="mdi:arrow-right"
						size={36}
						color={theme.colors.textTertiary}
					/>
				</Pressable>
			</LinearGradient>
		</ZoomableView>
	);
};

export default WorkSession;
