import { useTheme } from "@context/ThemeContext";
import { t } from "i18next";
import React from "react";
import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import SubSectionLink from "./SubSectionLink";
import { useData } from "@context/DataContext";
import ShareApp from "./ShareApp";
import FriendPreview from "./FriendPreview";

const MainSubSections = () => {
	const { theme } = useTheme();
	const { member } = useData();
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

				{(member?.friendRequestsReceived?.length ?? 0) > 0 && (
					<View
						className="rounded-full ml-2 p-1 w-6 h-6 flex items-center justify-center"
						style={{
							backgroundColor: theme.colors.redPrimary,
						}}
					>
						<Text className="text-center text-[12px] font-semibold text-white">
							{member?.friendRequestsReceived?.length || 0}
						</Text>
					</View>
				)}
			</SubSectionLink>

			<FriendPreview />
		</View>
	);
};

export default MainSubSections;
