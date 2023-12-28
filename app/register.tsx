import React, { useContext, useState } from "react";
import { View, TextInput, Button, Text, Pressable } from "react-native";
import { createUser } from "../db/users";
import { ThemeContext } from "../components/ThemContext";
import { useNavigation } from "expo-router";
import { Questions } from "../constants/slides";
import MultipleChoice from "../components/inputs/MultipleChoice";
import InputText from "../components/inputs/Text";
import SingleChoice from "../components/inputs/SingleChoice";
import { AntDesign } from "@expo/vector-icons";

export default function Register() {
	const { theme } = useContext(ThemeContext);
	const [answers, setAnswers]: any = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

	const goToNextQuestion = () => {
		if (currentQuestionIndex < Questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			console.log("All questions answered:", answers);
			// Add logic to handle validation or navigation
		}
	};

	const navigation: any = useNavigation();

	// const register = async () => {
	// 	if (password === passwordConfirm) {
	// 		try {
	// 			await createUser(email, password);
	// 			navigation.navigate("index");
	// 		} catch (error) {
	// 			console.error("Erreur lors de la création de l'utilisateur : ", error);
	// 		}
	// 	} else {
	// 		console.log("Les mots de passe ne sont pas identiques");
	// 	}
	// };
	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				style={{ color: theme.colors.text }}
				className="text-center text-2xl mt-24"
			>
				Inscription
			</Text>

			{currentQuestionIndex > 0 && (
				<Pressable
					onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
					className="absolute top-0 left-0 mt-24 ml-10"
				>
					<AntDesign
						name="left"
						size={24}
						color={theme.colors.text}
						style={{ textAlign: "center" }}
					/>
				</Pressable>
			)}

			<View className="flex flex-col gap-6 mx-auto justify-center items-center w-full mb-6 mt-12">
				{Questions[currentQuestionIndex].questionType &&
					Questions[currentQuestionIndex].questionType === "MultipleChoice" && (
						<MultipleChoice
							question={Questions[currentQuestionIndex].question}
							answers={Questions[currentQuestionIndex].answers}
							setAnswers={setAnswers}
							goToNextQuestion={goToNextQuestion}
						/>
					)}

				{Questions[currentQuestionIndex].questionType &&
					Questions[currentQuestionIndex].questionType === "SingleChoice" && (
						<SingleChoice
							question={Questions[currentQuestionIndex].question}
							answers={Questions[currentQuestionIndex].answers}
							setAnswers={setAnswers}
							goToNextQuestion={goToNextQuestion}
							singleChoice={true}
						/>
					)}

				{Questions[currentQuestionIndex].questionType &&
					Questions[currentQuestionIndex].questionType === "Text" && (
						<InputText
							question={Questions[currentQuestionIndex].question}
							answers={Questions[currentQuestionIndex].answers}
							setAnswers={setAnswers}
							goToNextQuestion={goToNextQuestion}
						/>
					)}
			</View>
		</View>
	);
}
