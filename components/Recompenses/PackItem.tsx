import { useTheme } from "@context/ThemeContext";
import { Pack } from "@type/pack";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";
import CachedImage from "@components/Shared/CachedImage";
import { BlurView } from "expo-blur";

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
		<TouchableOpacity
			onPress={handlePress}
			className="my-2 w-[95%] mx-auto h-36 relative flex flex-col items-center justify-start"
		>
			<CachedImage
				imagePath={"images/packs/" + pack.image}
				blurRadius={5}
				style={{
					width: "100%",
					height: "100%",
					borderRadius: 12,
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					zIndex: -1,
				}}
			/>

			<BlurView
				tint="extraLight"
				intensity={70}
				className="p-3 rounded-xl w-[95%] mt-3 flex flex-row items-center justify-start"
				style={{
					overflow: "hidden",
				}}
			>
				<Iconify
					icon="material-symbols:book-outline"
					size={20}
					color={theme.colors.text}
				/>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="text-[14px] text-center font-bold ml-2"
				>
					{pack.name}
				</Text>
			</BlurView>

			<View
				style={{
					position: "absolute",
					backgroundColor: theme.colors.primary,
					bottom: 6,
					right: 6,
				}}
				className="rounded-2xl px-4 py-2 my-1 w-fit flex flex-row items-center justify-center"
			>
				<Text
					style={{
						color: theme.colors.textSecondary,
					}}
					className="text-[12px] font-bold mr-2"
				>
					{t("discover")}
				</Text>
				<Iconify
					icon="mdi:arrow-right"
					size={18}
					color={theme.colors.textSecondary}
				/>
			</View>
		</TouchableOpacity>
	);
}
