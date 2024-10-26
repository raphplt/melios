import { ThemeContext } from "@context/ThemeContext";
import { useContext, useRef } from "react";
import { ActivityIndicator, Animated, Pressable, Text } from "react-native";
import { Answer } from "../../constants/Slides";

export default function ButtonNext({
	selectedAnswer,
	goToNextQuestion,
	isDisabled,
	label,
	isSubmitting,
}: {
	selectedAnswer: any;
	goToNextQuestion: (selectedAnswer: Answer) => void;
	isDisabled?: boolean;
	label?: string;
	isSubmitting?: boolean;
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
				className="text-white font-bold py-3 px-4 rounded-2xl my-3 mt-6 w-full mx-auto"
				style={{
					backgroundColor:
						isDisabled || !selectedAnswer
							? theme.colors.grayPrimary
							: theme.colors.primary,
				}}
				onPress={() => {
					if (selectedAnswer) {
						goToNextQuestion(selectedAnswer);
					}
				}}
				disabled={isDisabled || !selectedAnswer}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleTouchEnd}
				onTouchCancel={handleTouchEnd}
			>
				{isSubmitting ? (
					<ActivityIndicator
						color={"white"}
						size="small"
						style={{ marginRight: 10 }}
					/>
				) : (
					<Text
						style={{ color: theme.colors.textSecondary }}
						className="text-lg text-center"
					>
						{label || "Suivant"}
					</Text>
				)}
			</Pressable>
		</Animated.View>
	);
}
