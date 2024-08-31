import React, { useContext, useEffect, useState } from "react";
import { View, Image, BackHandler, Alert, ImageBackground } from "react-native";
import { useNavigation } from "expo-router";
import MultipleChoice from "@components/Inputs/MultipleChoice";
import InputPassword from "@components/Inputs/Password";
import SingleChoice from "@components/Inputs/SingleChoice";
import InputText from "@components/Inputs/Text";
import { ThemeContext } from "@context/ThemeContext";
import { checkEmailExists, createUser } from "@db/users";
import { Questions } from "../constants/Slides";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonBackRegister from "@components/LoginRegister/ButtonBackRegister";
import { BlurView } from "expo-blur";

const QUESTION_TYPES = {
	MULTIPLE_CHOICE: "MultipleChoice",
	SINGLE_CHOICE: "SingleChoice",
	TEXT: "Text",
	PASSWORD: "Password",
};

export default function Register() {
	const { theme } = useContext(ThemeContext);
	const [form, setForm] = useState<any[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const navigation = useNavigation<any>();

	const goToNextQuestion = async (answer: any) => {
		const currentQuestion = Questions[currentQuestionIndex];

		if (currentQuestion.slug === "email") {
			const emailExists = await checkEmailExists(answer);
			if (emailExists) {
				Alert.alert("Erreur", "Cette adresse e-mail est déjà utilisée.", [
					{ text: "OK" },
				]);
				return;
			}
		}

		if (currentQuestion.slug === "welcome" && answer.value === 2) {
			return;
		}

		if (currentQuestionIndex < Questions.length - 1) {
			setForm((prevForm) => [...prevForm, { [currentQuestion.slug]: answer }]);
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			try {
				const updatedForm = [...form, { [currentQuestion.slug]: answer }];
				const user = await createUser(updatedForm);
				if (user) {
					navigation.navigate("select");
				}
			} catch (error) {
				console.error("Erreur lors de la création de l'utilisateur : ", error);
			}
		}
	};

	const goBack = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
			form.pop();
			return true;
		}

		Alert.alert("Quitter", "Voulez-vous quitter Melios ?", [
			{ text: "Non" },
			{ text: "Oui", onPress: () => BackHandler.exitApp() },
		]);

		return true;
	};

	useEffect(() => {
		BackHandler.addEventListener("hardwareBackPress", goBack);

		return () => {
			BackHandler.removeEventListener("hardwareBackPress", goBack);
		};
	}, [currentQuestionIndex, form]);

	const renderQuestion = () => {
		const currentQuestion = Questions[currentQuestionIndex];
		const { questionType, question, answers, slug } = currentQuestion;

		switch (questionType) {
			case QUESTION_TYPES.MULTIPLE_CHOICE:
				return (
					<MultipleChoice
						question={question}
						answers={answers}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			case QUESTION_TYPES.SINGLE_CHOICE:
				return (
					<SingleChoice
						question={question}
						answers={answers}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			case QUESTION_TYPES.TEXT:
				return (
					<InputText
						question={question}
						answers={answers}
						slug={slug}
						form={form}
						setForm={setForm}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			case QUESTION_TYPES.PASSWORD:
				return (
					<InputPassword
						question={question}
						answers={answers}
						slug={slug}
						form={form}
						setForm={setForm}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<View className="" style={{ flex: 1 }}>
			<ImageBackground
				source={require("../assets/images/illustrations/register-bg.jpg")}
				resizeMode="cover"
				style={{
					flex: 1,
					justifyContent: "center",
				}}
			>
				{currentQuestionIndex > 0 && (
					<ButtonBackRegister
						setCurrentQuestionIndex={setCurrentQuestionIndex}
						currentQuestionIndex={currentQuestionIndex}
						form={form}
						setForm={setForm}
					/>
				)}
				<BlurView
					intensity={70}
					className=" mx-auto p-5 rounded-xl w-11/12"
					style={{
						overflow: "hidden",
					}}
				>
					<View className="flex flex-col items-center">
						<Image
							source={require("../assets/images/icon.png")}
							style={{ width: 100, height: 100 }}
							className="mb-5"
						/>
						{currentQuestionIndex < Questions.length && renderQuestion()}
						<ButtonNavigate
							text="J'ai déjà un compte"
							color="white"
							onPress={() => navigation.navigate("login")}
						/>
					</View>
				</BlurView>
			</ImageBackground>
		</View>
	);
}