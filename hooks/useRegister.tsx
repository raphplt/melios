import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";
import { useNavigation } from "expo-router";
import { checkEmailExists, createUser } from "@db/users";
import { Answer, Question, Questions } from "../constants/Slides";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import InputPassword from "@components/LoginRegister/InputPassword";
import InputText from "@components/LoginRegister/InputText";
import MultipleChoice from "@components/LoginRegister/MultipleChoice";
import SingleChoice from "@components/LoginRegister/SingleChoice";

export default function useFormHandler() {
	const [form, setForm] = useState<Question[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const goToNextQuestion = async (answer: Answer) => {
		const currentQuestion = Questions[currentQuestionIndex];

		if (currentQuestion.slug === "email") {
			const emailExists = await checkEmailExists(answer.answer);
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
			const updatedQuestion: Question = {
				...currentQuestion,
				answers: [answer],
			};

			setForm((prevForm) => [...prevForm, updatedQuestion]);
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			try {
				const updatedQuestion: Question = {
					...currentQuestion,
					answers: [answer],
				};
				const updatedForm = [...form, updatedQuestion];

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
			setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
			setForm((prevForm) => prevForm.slice(0, -1));
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
			case "MultipleChoice":
				return (
					<MultipleChoice
						question={question}
						answers={answers}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			case "SingleChoice":
				return (
					<SingleChoice
						question={question}
						answers={answers}
						goToNextQuestion={goToNextQuestion}
					/>
				);
			case "Text":
				return (
					<InputText
						question={question}
						goToNextQuestion={goToNextQuestion}
						slug={slug}
					/>
				);
			case "Password":
				return (
					<InputPassword question={question} goToNextQuestion={goToNextQuestion} />
				);
			default:
				return null;
		}
	};

	return {
		currentQuestionIndex,
		form,
		setCurrentQuestionIndex,
		setForm,
		renderQuestion,
		goBack,
		goToNextQuestion,
		navigation,
	};
}
