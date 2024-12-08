import { useState } from "react";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	const [buttonText, setButtonText] = useState("Découvrir");

	const handlePress = () => {
		setButtonText("Bientôt disponible");
	};

	return (
		<LinearGradient
			style={{
				borderColor: pack.color ?? theme.colors.cardBackground,
				borderWidth: 2,
			}}
			start={[0, 0]}
			colors={[theme.colors.cardBackground, pack.color ?? theme.colors.background]}
			className="mx-auto rounded-xl w-[95%] p-3 my-2 opacity-50"
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
				<View className="flex flex-row items-center">
					<Text
						className="font-semibold mx-1 text-[16px]"
						style={{
							color: theme.colors.textTertiary,
						}}
					>
						{pack.price}
					</Text>
					<MoneyMelios />
				</View>
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
