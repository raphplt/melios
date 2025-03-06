import {
	View,
	Text,
	useWindowDimensions,
	Modal,
	Pressable,
	ScrollView,
	Animated,
	StatusBar,
	Image,
} from "react-native";
import { useRef } from "react";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import onboarding1 from "@assets/images/onboarding/onboarding1.png";
import onboarding2 from "@assets/images/onboarding/onboarding2.png";
import onboarding3 from "@assets/images/onboarding/onboarding3.png";
import onboarding4 from "@assets/images/onboarding/onboarding4.png";
import ZoomableView from "@components/Shared/ZoomableView";

export default function HelpModal({
	visible,
	setVisible,
	onClose,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onClose: () => void;
}) {
	const { width, height } = useWindowDimensions();
	const { theme } = useTheme();
	const { t } = useTranslation();
	const scrollX = useRef(new Animated.Value(0)).current;
	const scrollViewRef = useRef<ScrollView>(null);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	// Use the imported images
	const imagePaths = [onboarding1, onboarding2, onboarding3, onboarding4];

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{ useNativeDriver: false }
	);

	const handleFinish = () => {
		setVisible(false);
		if (navigation.canGoBack()) navigation.goBack();
		AsyncStorage.setItem("firstTime", "false");
	};

	const texts = [
		{
			title: t("habit_onboarding"),
			description: t("habit_onboarding_description"),
		},
		{
			title: t("progress_onboarding"),
			description: t("progress_onboarding_description"),
		},
		{
			title: t("reward_onboarding"),
			description: t("reward_onboarding_description"),
		},
		{
			title: t("agora_onboarding"),
			description: t("agora_onboarding_description"),
		},
	];

	const renderImages = () => {
		return imagePaths.map((uri, index) => (
			<View
				key={index}
				style={{
					width,
					height: height - 100,
				}}
				className="mx-auto flex items-center justify-evenly"
			>
				<StatusBar
					barStyle={"light-content"}
					backgroundColor="transparent"
					translucent={true}
				/>
				<Image
					source={uri}
					width={500}
					height={600}
					style={{
						width: width,
						height: 500,
						resizeMode: "contain",
					}}
				/>

				{index < texts.length && (
					<>
						<Text
							style={{
								color: "#1a1a1a",
							}}
							className="mt-10 text-3xl font-bold"
						>
							{texts[index].title}
						</Text>
						<Text
							style={{
								color: "#5b5b5b",
								marginTop: 10,
							}}
							className="text-center w-10/12"
						>
							{texts[index].description}
						</Text>
					</>
				)}

				{index !== imagePaths.length - 1 ? (
					<ZoomableView className="flex flex-row items-center justify-center w-11/12 mx-auto mt-5 ">
						<Pressable
							className="py-4 px-24 rounded-xl w-full flex flex-row items-center justify-center"
							style={{
								backgroundColor: "rgb(8, 32, 159)",
							}}
							onPress={() => {
								scrollViewRef.current?.scrollTo({
									x: width * (index + 1),
									animated: true,
								});
							}}
						>
							<Text
								style={{
									color: "#fff",
								}}
								className="text-xl font-semibold"
							>
								{t("go_next")}
							</Text>
						</Pressable>
					</ZoomableView>
				) : (
					<ZoomableView className="flex flex-row items-center justify-center w-11/12 mx-auto mt-5 ">
						<Pressable
							className="py-4 px-24 rounded-xl w-full flex flex-row items-center justify-center"
							style={{
								backgroundColor: "rgb(8, 32, 159)",
							}}
							onPress={handleFinish}
						>
							<Text
								style={{
									color: "#fff",
								}}
								className="text-xl font-semibold"
							>
								{t("start_now")}
							</Text>
						</Pressable>
					</ZoomableView>
				)}
			</View>
		));
	};
	return (
		<Modal
			visible={visible}
			transparent={false}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: "#fff",
				}}
			>
				<Pressable
					onPress={onClose}
					style={{
						position: "absolute",
						top: "3%",
						right: 20,
						zIndex: 10,
					}}
				>
					<Text
						style={{
							color: "#5b5b5b",
						}}
					>
						{t("skip")}
					</Text>
				</Pressable>

				<ScrollView
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					onScroll={handleScroll}
					scrollEventThrottle={16}
					ref={scrollViewRef}
				>
					{renderImages()}
				</ScrollView>

				<View
					style={{
						flexDirection: "row",
						position: "absolute",
						bottom: 20,
						alignSelf: "center",
					}}
				>
					{imagePaths.map((_, index) => {
						const opacity = scrollX.interpolate({
							inputRange: [(index - 1) * width, index * width, (index + 1) * width],
							outputRange: [0.3, 1, 0.3],
							extrapolate: "clamp",
						});
						return (
							<Animated.View
								key={index}
								style={{
									opacity,
									height: 10,
									width: 10,
									backgroundColor: theme.colors.text,
									margin: 8,
									borderRadius: 5,
								}}
							/>
						);
					})}
				</View>
			</View>
		</Modal>
	);
}