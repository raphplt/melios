import React, { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, BackHandler, Alert } from "react-native";
import { createUser } from "../db/users";
import { ThemeContext } from "../components/ThemeContext";
import { useNavigation } from "expo-router";
import { Questions } from "../constants/slides";
import MultipleChoice from "../components/inputs/MultipleChoice";
import InputText from "../components/inputs/Text";
import SingleChoice from "../components/inputs/SingleChoice";
import { AntDesign } from "@expo/vector-icons";
import InputPassword from "../components/inputs/Password";
import { checkEmailExists } from "../db/users";

export default function Register() {
	const { theme } = useContext(ThemeContext);
	const [form, setForm]: any = useState([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const navigation: any = useNavigation();

	const goToNextQuestion = async (answer: any) => {
		if (Questions[currentQuestionIndex].slug === "email") {
			const emailExists = await checkEmailExists(answer);
			if (emailExists) {
				Alert.alert("Erreur", "Cette adresse e-mail est déjà utilisée.", [
					{ text: "OK" },
				]);
				return;
			} else {
				console.log("Cette adresse e-mail est disponible.");
			}
		}

		if (Questions[currentQuestionIndex].slug === "welcome") {
			if (answer.value === 2) {
				return;
			}
		}

		if (currentQuestionIndex < Questions.length - 1) {
			setForm((prevForm: any) => [
				...prevForm,
				{ [Questions[currentQuestionIndex].slug]: answer },
			]);
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		} else {
			try {
				const updatedForm = [
					...form,
					{ [Questions[currentQuestionIndex].slug]: answer },
				];
				const user = await createUser(updatedForm);
				if (user) {
					console.log("Redirection");
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

		Alert.alert("Quitter", "Voulez-vous quitter l'application ?", [
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

	return (
		<View
			style={{ backgroundColor: theme.colors.background }}
			className="h-[100vh] flex flex-col justify-evenly items-center w-screen"
		>
			{currentQuestionIndex > 0 && (
				<Pressable
					onPress={() => {
						setCurrentQuestionIndex(currentQuestionIndex - 1);
						form.pop();
					}}
					className="absolute top-12 left-0 mt-8 ml-8 flex flex-row items-center"
				>
					<AntDesign
						name="left"
						size={18}
						color={theme.colors.text}
						style={{ textAlign: "center" }}
					/>
					<Text
						style={{ color: theme.colors.text }}
						className="text-center text-md font-semibold ml-2"
					>
						Précédent
					</Text>
				</Pressable>
			)}
			{currentQuestionIndex - 1 < Questions.length ? (
				<View className="flex flex-col ">
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

			<Pressable
				onPress={() => {
					navigation.navigate("login");
				}}
				style={{
					borderWidth: 1,
					borderColor: theme.colors.primary,
					backgroundColor: theme.colors.cardBackground,
				}}
				className=" p-2 rounded-xl mt-4 w-1/3 mx-auto absolute bottom-0 mb-8 border-[1px]"
			>
				<Text
					style={{
						color: theme.colors.primary,
					}}
					className="text-center text-md font-semibold"
				>
					Ou Se connecter
				</Text>
			</Pressable>
		</View>
	);
}
