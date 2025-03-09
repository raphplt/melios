import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Iconify } from "react-native-iconify";

type SubSectionLinkProps = {
	href: string;
	children: React.ReactNode;
};

const SubSectionLink = ({ href, children }: SubSectionLinkProps) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<ZoomableView>
			<Pressable
				className="flex flex-row items-center justify-between px-6 py-3 my-2 rounded-xl w-[95%] mx-auto"
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
					shadowColor: "#000",
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.1,
					shadowRadius: 4,
					elevation: 2,
				}}
				onPress={() => navigation.navigate(href)}
			>
				<View className="flex flex-row items-center">{children}</View>
				<Iconify icon="mdi:chevron-right" size={28} color={theme.colors.primary} />
			</Pressable>
		</ZoomableView>
	);
};

export default SubSectionLink;
