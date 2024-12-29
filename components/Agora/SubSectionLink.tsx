import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { t } from "i18next";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";
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
				className="p-4 rounded-lg my-2 w-11/12 mx-auto flex flex-row items-center justify-between"
				style={{
					backgroundColor: theme.colors.cardBackground,
					// borderColor: theme.colors.border,
					// borderWidth: 1,
				}}
				onPress={() => navigation.navigate(href)}
			>
				<View className="flex flex-row items-center">{children}</View>
				<Iconify icon="mdi:chevron-right" size={28} color={theme.colors.text} />
			</Pressable>
		</ZoomableView>
	);
};

export default SubSectionLink;
