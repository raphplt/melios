import HomeFeed from "@components/Agora/HomeFeed";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

export default function Agora() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<View className="flex-1">
			<ZoomableView>
				<Pressable
					className="p-4 rounded-lg my-3 w-11/12 mx-auto flex flex-row items-center justify-between"
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
					onPress={() => navigation.navigate("classement")}
				>
					<View className="flex flex-row items-center">
						<Iconify icon="mdi:trophy" size={20} color={theme.colors.text} />
						<Text
							className="ml-3 text-lg text-center font-semibold"
							style={{
								color: theme.colors.text,
							}}
						>
							{t("access_ranking")}
						</Text>
					</View>
					<Iconify icon="mdi:chevron-right" size={28} color={theme.colors.text} />
				</Pressable>
			</ZoomableView>
			<HomeFeed />
		</View>
	);
}
