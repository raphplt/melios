import { useTheme } from "@context/ThemeContext";
import { t } from "i18next";
import React from "react";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import SubSectionLink from "./SubSectionLink";

const MainSubSections = () => {
	const { theme } = useTheme();
	return (
		<View className="flex flex-col items-center justify-center w-full">
			<SubSectionLink href="classement">
				<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
				<Text
					className="ml-3 text-lg text-center font-semibold"
					style={{
						color: theme.colors.text,
					}}
				>
					{t("access_ranking")}
				</Text>
			</SubSectionLink>
			<SubSectionLink href="feed">
				<Iconify icon="material-symbols:feed" size={20} color={theme.colors.text} />
				<Text
					className="ml-3 text-lg text-center font-semibold"
					style={{
						color: theme.colors.text,
					}}
				>
					{t("access_news_feed")}
				</Text>
			</SubSectionLink>
			<SubSectionLink href="friendList">
				<Iconify icon="mdi:users" size={20} color={theme.colors.text} />
				<Text
					className="ml-3 text-lg text-center font-semibold"
					style={{
						color: theme.colors.text,
					}}
				>
					{t("friend_list")}
				</Text>
			</SubSectionLink>
		</View>
	);
};

export default MainSubSections;
