import { useTheme } from "@context/ThemeContext";
import { View } from "react-native";
import AccountBlock from "./AccountBlock";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";
import RowBlock from "./RowBlock";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";

export default function General() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { habits } = useData();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<AccountBlock title={t("general")}>
			<RowBlock
				icon={
					<Iconify
						icon="icon-park-outline:list"
						size={20}
						color={theme.colors.primary}
					/>
				}
				title={t("my_habits")}
				count={habits.length}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={() => navigation.navigate("editHabits")}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View>
			{/* <RowBlock
				icon={<Iconify icon="ph:target" size={20} color={theme.colors.primary} />}
				title={t("my_objectives")}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={() => navigation.navigate("editGoals")}
			/>
			<View className="w-full h-[1px] bg-gray-300"></View> */}

			<RowBlock
				icon={
					<Iconify
						icon="fluent:person-feedback-16-regular"
						size={20}
						color={theme.colors.primary}
					/>
				}
				title={t("feedback")}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
				onPress={() => navigation.navigate("feedbackForm")}
			/>
		</AccountBlock>
	);
}
