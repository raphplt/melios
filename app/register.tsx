import React, { useEffect, useState } from "react";
import { View, Image, ImageBackground } from "react-native";
import { BlurView } from "expo-blur";
import ButtonNavigate from "@components/LoginRegister/ButtonNavigate";
import ButtonBackRegister from "@components/LoginRegister/ButtonBackRegister";
import useFormHandler from "@hooks/useRegister";
import { getCachedImage } from "@db/files";
import { useTranslation } from "react-i18next";

export default function Register() {
	const {
		currentQuestionIndex,
		form,
		setCurrentQuestionIndex,
		setForm,
		renderQuestion,
		navigation,
	} = useFormHandler();

	const [image, setImage] = useState<string | null>("images/fallback.png");
	const { t } = useTranslation();

	useEffect(() => {
		let isMounted = true;
		const fetchImage = async () => {
			try {
				const localUri = await getCachedImage(
					`images/illustrations/register-bg.jpg`
				);
				if (isMounted) setImage(localUri);
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		fetchImage();

		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<ImageBackground
				source={image ? { uri: image } : undefined}
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
					tint="default"
				>
					<View className="flex flex-col items-center">
						<Image
							source={require("@assets/images/icon.png")}
							style={{ width: 100, height: 100 }}
							className="mb-5"
						/>
						{renderQuestion()}
					</View>
				</BlurView>
				<ButtonNavigate
					text={t("already_account")}
					color="white"
					onPress={() => navigation.navigate("login")}
				/>
			</ImageBackground>
		</View>
	);
}
