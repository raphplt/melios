import { useTheme } from "@context/ThemeContext";
import { View, Text, ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";
import PackItem from "./PackItem";
import { packs } from "@constants/packs";
import { useTranslation } from "react-i18next";

export default function MarketPacks() {
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<View
			style={{
				backgroundColor: theme.colors.background,
				flex: 1,
			}}
			className="mb-20"
		>
			<View className="w-11/12 mx-auto py-1 mt-5">
				<View className="flex flex-row items-center justify-start w-full mx-auto">
					<Iconify icon="mdi:gift-outline" size={24} color={theme.colors.text} />
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="mx-2 text-[16px] font-semibold"
					>
						{t("rewards_packs")}
					</Text>
				</View>
			</View>
			<ScrollView showsVerticalScrollIndicator={false}>
				{packs.map((pack) => (
					<PackItem key={pack.name} pack={pack} />
				))}
			</ScrollView>
		</View>
	);
}
