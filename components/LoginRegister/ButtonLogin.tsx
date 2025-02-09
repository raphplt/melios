import { ActivityIndicator, Animated, Pressable, Text } from "react-native";
import { useRef } from "react";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function ButtonLogin({
	login,
	isDisabled,
	isLoading,
}: {
	login: () => void;
	isDisabled: boolean;
	isLoading: boolean;
}) {
	const scaleAnim = useRef(new Animated.Value(1)).current;
	const { theme } = useTheme();
	const { t } = useTranslation();

	return (
		<Pressable
			disabled={isDisabled}
			style={{
				backgroundColor: isDisabled
					? theme.colors.grayPrimary
					: theme.colors.primary,
			}}
			className="w-11/12 mx-auto py-4 rounded-xl focus:bg-blue-800 mt-6 flex items-center"
		>
			{isLoading ? (
				<ActivityIndicator size="small" color={"#F8F9FF"} />
			) : (
				<Text
					style={{ color: "#F8F9FF" }}
					className="text-[18px] text-center font-semibold"
				>
					{t("login_bis")}
				</Text>
			)}
		</Pressable>
	);
}
