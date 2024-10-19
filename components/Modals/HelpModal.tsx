import {
	View,
	Text,
	Image,
	useWindowDimensions,
	Modal,
	Pressable,
	ScrollView,
	Animated,
	TouchableOpacity,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { useRef } from "react";
import { useTheme } from "@context/ThemeContext";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
	const scrollX = useRef(new Animated.Value(0)).current;
	const scrollViewRef = useRef<ScrollView>(null);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const images = [
		require("@assets/images/onboarding/1.png"),
		require("@assets/images/onboarding/2.png"),
		require("@assets/images/onboarding/3.png"),
		require("@assets/images/onboarding/4.png"),
		require("@assets/images/onboarding/5.png"),
	];

	const handleScroll = Animated.event(
		[{ nativeEvent: { contentOffset: { x: scrollX } } }],
		{ useNativeDriver: false }
	);

	const handleFinish = () => {
		setVisible(false);
		if (navigation.canGoBack()) navigation.goBack();
		AsyncStorage.setItem("firstTime", "false");
	};

	const renderImages = () => {
		return images.map((image, index) => (
			<View
				key={index}
				style={{ width, height: height - 100 }}
				className="mx-auto flex items-center justify-center"
			>
				<Image
					source={image}
					style={{
						width: width - 30,
						height: height - 100,
						resizeMode: "contain",
					}}
				/>
				{index === images.length - 1 && (
					<TouchableOpacity
						style={{
							backgroundColor: theme.colors.primary,
						}}
						className="absolute bottom-10 bg-primary py-4 px-24 rounded-3xl"
						onPress={() => {
							handleFinish();
						}}
					>
						<Text className="text-white text-lg font-semibold">Découvrir</Text>
					</TouchableOpacity>
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
						top: "6%",
						right: 20,
						zIndex: 10,
					}}
				>
					<Iconify icon="mdi:close" size={30} color={theme.colors.text} />
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
					{images.map((_, index) => {
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
