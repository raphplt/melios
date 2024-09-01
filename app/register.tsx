import React from "react";
import { View, Image, ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonBackRegister from "@components/LoginRegister/ButtonBackRegister";
import useFormHandler from "@hooks/useRegister";

export default function Register() {
	const {
		currentQuestionIndex,
		form,
		setCurrentQuestionIndex,
		setForm,
		renderQuestion,
		navigation,
	} = useFormHandler();

	return (
		<View style={{ flex: 1 }}>
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
					className="mx-auto p-5 rounded-xl w-11/12"
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
						{renderQuestion()}
					</View>
				</BlurView>
				<ButtonNavigate
					text="J'ai déjà un compte"
					color="white"
					onPress={() => navigation.navigate("login")}
				/>
			</ImageBackground>
		</View>
	);
}
