import ButtonNext from "@components/LoginRegister/ButtonNext";
import CustomTextInput from "@components/Shared/CustomTextInput";
import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Answer } from "../../constants/Slides";
import { isValidEmail } from "@utils/dataValidation";

export default function InputText({
    question,
    goToNextQuestion,
    error,
    slug,
}: {
    question: string;
    goToNextQuestion: (answer: Answer) => void;
    error?: string;
    slug: string;
}) {
    const [text, setText] = useState("");
    const [showError, setShowError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    const resetText = () => {
        setText("");
        setShowError(false);
        setIsDisabled(true);
    };

    useEffect(() => {
        resetText();
    }, [question]);

    const handleTextChange = (inputText: string) => {
        setText(inputText);
        validateInput(inputText);
    };

    const isValidName = (name: string) => {
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]{1,40}$/;
        return nameRegex.test(name);
    };

    const validateInput = (inputText: string) => {
        if (slug === "email") {
            setIsDisabled(!isValidEmail(inputText));
        } else if (slug === "name") {
            setIsDisabled(!isValidName(inputText));
        } else {
            setIsDisabled(inputText.trim().length <= 1);
        }
    };

    const goNext = () => {
        if (!isDisabled) {
            const answer: Answer = {
                answer: text,
                value: 1,
            };
            goToNextQuestion(answer);
            resetText();
        } else {
            setShowError(true);
        }
    };

    return (
					<View className="w-full flex flex-col justify-between">
						<CustomTextInput
							label={question}
							placeholder="Votre réponse"
							autoFocus={true}
							value={text}
							onChangeText={handleTextChange}
							onFocus={() => setShowError(false)}
							textColor={"white"}
							returnKeyType="next"
							keyboardType={slug === "email" ? "email-address" : "default"}
						/>

						<ButtonNext
							selectedAnswer={text}
							goToNextQuestion={goNext}
							isDisabled={isDisabled}
						/>
						{showError && (
							<Text style={{ color: "red", textAlign: "center" }}>
								{error ||
									(slug === "email"
										? "Veuillez entrer un email valide"
										: "Veuillez renseigner ce champ")}
							</Text>
						)}
					</View>
				);
}