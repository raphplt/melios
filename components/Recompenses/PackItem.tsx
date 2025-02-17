import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import CachedImage from "@components/Shared/CachedImage";
import { Svg, Path } from "react-native-svg";
import ZoomableView from "@components/Shared/ZoomableView";

export default function PackItem({ pack }: { pack: Pack }) {
	const { theme } = useTheme();
	const { setSelectedPack } = useData();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const handlePress = () => {
		navigation.navigate("pack");
		setSelectedPack(pack);
	};

	return (
		<ZoomableView>
			<View className="my-2 w-[95%] mx-auto flex flex-col items-center justify-start">
				<Pressable
					onPress={handlePress}
					className="h-36 relative w-full flex flex-row"
				>
					<View
						className="w-1/2 flex justify-center items-start px-2"
						style={{
							backgroundColor: theme.colors.cardBackground,
							borderTopLeftRadius: 10,
							borderBottomLeftRadius: 10,
						}}
					>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="font-semibold text-lg ml-2"
						>
							{pack.name}
						</Text>
					</View>
					<View className="w-1/2 h-full relative">
						<CachedImage
							imagePath={"images/packs/" + pack.image}
							style={{
								width: "100%",
								height: "100%",
								borderTopRightRadius: 10,
								borderBottomRightRadius: 10,
							}}
						/>
						<Svg
							width="61%"
							height="100%"
							viewBox="0 0 100 100"
							preserveAspectRatio="none"
							style={{
								position: "absolute",
								top: 0,
								left: -1,
							}}
						>
							<Path d="M-1,0 L81,100 L-1,100 Z" fill={theme.colors.cardBackground} />
						</Svg>
					</View>
				</Pressable>
			</View>
		</ZoomableView>
	);
}