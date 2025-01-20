import { ScrollView } from "react-native";
import Version from "@components/Account/Version";
import MemberInfos from "@components/Account/MemberInfos";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { auth } from "@db/index";
import General from "@components/Account/General";
import Preferences from "@components/Account/Preferences";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Account() {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const { member, isLoading } = useData();

	if (isLoading) return <LoaderScreen />;

	return (
		<ScrollView
			showsVerticalScrollIndicator={false}
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			contentContainerStyle={{
				flexGrow: 1,
			}}
		>
			<MemberInfos member={member} auth={auth} />
			<General />
			<Preferences />

			<Version />
		</ScrollView>
	);
}
