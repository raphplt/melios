import { useEffect, useState } from "react";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable, Image } from "react-native";
import { getImageURL } from "@db/image"; // Importez la fonction getImageURL

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	const [imageUrl, setImageUrl] = useState<string | null>(null);

	useEffect(() => {
		const fetchImage = async () => {
			try {
				const url = await getImageURL();
				setImageUrl(url);
			} catch (error) {
				console.error("Erreur lors de la récupération de l'image : ", error);
			}
		};

		fetchImage();
	}, []);

	return (
		<View
			style={{
				borderColor: pack.color ?? theme.colors.background,
				borderWidth: 2,
				backgroundColor: theme.colors.cardBackground,
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
			{imageUrl && (
				<Image source={{ uri: imageUrl }} style={{ width: 100, height: 100 }} />
			)}
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
