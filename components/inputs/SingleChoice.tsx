import { useContext } from "react";
import { View, Text, Button, Pressable } from "react-native";
import { ThemeContext } from "../ThemContext";

export default function SingleChoice(props: any) {
	const { theme } = useContext(ThemeContext);

	return (
		<View>
			<Text
				style={{ color: theme.colors.text }}
				className="text-xl text-center mb-4 "
			>
				{props.question}
			</Text>
			{props.answers.map((answer: any, index: any) => (
				<Pressable
					key={index}
					onPress={() => {
						props.setAnswers([...props.answers, { [props.slug]: answer }]);
						props.goToNextQuestion();
					}}
					style={({ pressed }) => [
						{
							backgroundColor: pressed
								? theme.colors.background
								: theme.colors.backgroundSecondary,
							borderColor: theme.colors.text,
							borderWidth: 1,
							borderRadius: 20,
							flexDirection: "row",
							alignItems: "center",
							padding: 10,
							marginVertical: 7,
						},
					]}
				>
					<View
						style={{
							width: 20,
							height: 20,
							borderRadius: 10,
							backgroundColor: theme.colors.inactiveSwitch,
							marginRight: 10,
							borderWidth: 1,
							borderColor: theme.colors.text,
						}}
					/>
					<Text style={{ color: theme.colors.text }} className="text-lg">
						{answer.answer}
					</Text>
				</Pressable>
			))}
		</View>
	);
}
