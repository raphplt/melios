import MoneyMelios from "@components/Svg/MoneyMelios";
import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable } from "react-native";

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	return (
		<View
			style={{
				backgroundColor: pack.color ?? theme.colors.background,
			}}
			className=" mx-auto rounded-xl w-11/12 p-3 my-2"
		>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-[16px]"
			>
				{pack.name}
			</Text>

			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="py-2"
			>
				{pack.description}
			</Text>

			<View className="flex flex-row items-center">
				<Text className="font-semibold mx-1">{pack.price}</Text>

				<MoneyMelios />
			</View>
			<Pressable
				style={{
					backgroundColor: theme.colors.primary,
					padding: 10,
					borderRadius: 5,
					marginTop: 10,
				}}
			>
				<Text
					style={{
						color: theme.colors.textSecondary,
						fontFamily: "BaskervilleBold",
					}}
					className="text-center"
				>
					Acheter
				</Text>
			</Pressable>
		</View>
	);
}
