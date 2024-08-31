import { ThemeContext } from "@context/ThemeContext";
import { useContext, useRef } from "react";
import { Animated, Pressable, Text } from "react-native";

export default function ButtonNext({
	selectedAnswer,
	goToNextQuestion,
}: {
	selectedAnswer: any;
	goToNextQuestion: (selectedAnswer: any) => void;
}) {
	const { theme } = useContext(ThemeContext);
	const scaleAnim = useRef(new Animated.Value(1)).current;

	const handleTouchStart = () => {
		Animated.spring(scaleAnim, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};

	const handleTouchEnd = () => {
		Animated.spring(scaleAnim, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	return (
		<Animated.View
			style={{
				transform: [{ scale: scaleAnim }],
			}}
		>
			<Pressable
				className=" text-white font-bold py-2 px-4 rounded-3xl my-3 mt-4 w-full mx-auto"
				style={{
					backgroundColor: !selectedAnswer
						? theme.colors.grayPrimary
						: theme.colors.primary,
				}}
				onPress={() => {
					if (selectedAnswer) {
						goToNextQuestion(selectedAnswer);
					}
				}}
				disabled={!selectedAnswer}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-lg text-center"
				>
					Continuer
				</Text>
			</Pressable>
		</Animated.View>
	);
}
