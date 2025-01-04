import { useState } from "react";
import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	const [buttonText, setButtonText] = useState("Découvrir");
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handlePress = () => {
		navigation.navigate("pack");
	};

	return (
		<LinearGradient
			style={{
				borderRadius: 10,
			}}
			start={[0, 0]}
			colors={[pack.color ?? theme.colors.background, theme.colors.cardBackground]}
			className="mx-auto rounded-xl w-[95%] p-3 my-2"
		>
			<View className="flex flex-row items-center justify-between">
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-[16px]"
				>
					{pack.name}
				</Text>
			</View>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="py-2"
			>
				{pack.description}
			</Text>

			<Pressable
				style={{
					backgroundColor: theme.colors.primary,
				}}
				className="rounded-lg p-3 my-1"
				onPress={handlePress}
			>
				<Text
					style={{
						color: theme.colors.textSecondary,
					}}
					className="text-center font-semibold text-[16px]"
				>
					{buttonText}
				</Text>
			</Pressable>
		</LinearGradient>
	);
}
