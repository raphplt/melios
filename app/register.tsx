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
import InputPassword from "../components/inputs/Password";

export default function Register() {
	const { theme } = useContext(ThemeContext);
	const [form, setForm]: any = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const navigation: any = useNavigation();

	const goToNextQuestion = async (answer: any) => {
		if (currentQuestionIndex < Questions.length - 1) {
			setForm((prevForm: any) => {
				const updatedForm = [
					...prevForm,
					{ [Questions[currentQuestionIndex].slug]: answer },
				];
				console.log("Next question, actual form : ", updatedForm);
				return updatedForm;
			});

			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			
			try {
				await setForm(async (prevForm: any) => {
					const updatedForm = [
						...prevForm,
						{ [Questions[currentQuestionIndex].slug]: answer },
					];
					
					
					await createUser(updatedForm).then(() => {
						navigation.navigate("select");
					});
				});
			} catch (error) {
				console.error("Erreur lors de la création de l'utilisateur : ", error);
			}
		}
	};

	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				style={{ color: theme.colors.text }}
				className="text-center text-2xl mt-24"
			>
				Inscription {currentQuestionIndex + 1}/{Questions.length}
			</Text>

			{currentQuestionIndex > 0 && (
				<Pressable
					onPress={() => {
						setCurrentQuestionIndex(currentQuestionIndex - 1);
						form.pop();
					}}
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
			{currentQuestionIndex - 1 < Questions.length ? (
				<View className="flex flex-col gap-6 mx-auto justify-center items-center w-11/12 mb-6 mt-12">
					{Questions[currentQuestionIndex].questionType &&
						Questions[currentQuestionIndex].questionType === "MultipleChoice" && (
							<MultipleChoice
								question={Questions[currentQuestionIndex].question}
								answers={Questions[currentQuestionIndex].answers}
								form={form}
								setForm={setForm}
								slug={Questions[currentQuestionIndex].slug}
								goToNextQuestion={goToNextQuestion}
							/>
						)}

					{Questions[currentQuestionIndex].questionType &&
						Questions[currentQuestionIndex].questionType === "SingleChoice" && (
							<SingleChoice
								question={Questions[currentQuestionIndex].question}
								answers={Questions[currentQuestionIndex].answers}
								slug={Questions[currentQuestionIndex].slug}
								form={form}
								setForm={setForm}
								goToNextQuestion={goToNextQuestion}
								singleChoice={true}
							/>
						)}

					{Questions[currentQuestionIndex].questionType &&
						Questions[currentQuestionIndex].questionType === "Text" && (
							<InputText
								question={Questions[currentQuestionIndex].question}
								answers={Questions[currentQuestionIndex].answers}
								slug={Questions[currentQuestionIndex].slug}
								form={form}
								setForm={setForm}
								goToNextQuestion={goToNextQuestion}
							/>
						)}
					{Questions[currentQuestionIndex].questionType &&
						Questions[currentQuestionIndex].questionType === "Password" && (
							<InputPassword
								question={Questions[currentQuestionIndex].question}
								answers={Questions[currentQuestionIndex].answers}
								slug={Questions[currentQuestionIndex].slug}
								form={form}
								setForm={setForm}
								goToNextQuestion={goToNextQuestion}
							/>
						)}
				</View>
			) : (
				<Text
					style={{ color: theme.colors.text }}
					className="text-center text-2xl mt-24"
				>
					Fin du questionnaire
				</Text>
			)}
		</View>
	);
}
