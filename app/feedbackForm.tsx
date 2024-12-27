import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, View, TextInput, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-native-element-dropdown";
import Slider from "@react-native-community/slider";
import ButtonClose from "@components/Shared/ButtonClose";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@db/index"; // Assurez-vous que le chemin est correct

export default function FeedbackForm() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm({
		defaultValues: {
			name: "",
			email: "",
			feedback: "",
			rating: 5,
			category: null,
		},
	});

	const onSubmit = async (data: any) => {
		setIsSubmitting(true);
		setSubmitSuccess(false);
		try {
			// Envoyer les données à Firestore
			await addDoc(collection(db, "feedbacks"), data);
			console.log("Feedback soumis :", data);
			reset(); // Réinitialise le formulaire après soumission
			setSubmitSuccess(true);
		} catch (error) {
			console.error("Erreur lors de l'envoi du feedback :", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const categories = [
		{ label: "Bug", value: "bug" },
		{ label: "Traduction manquante", value: "missing_translation" },
		{ label: "Suggestion", value: "suggestion" },
		{ label: "Collaboration", value: "collaboration" },
		{ label: "Autre", value: "other" },
	];

	return (
		<View className="flex-1 bg-background p-6 mt-4">
			<ButtonClose />

			<Text className="text-center text-2xl font-bold text-text mb-4">
				{t("feedback_form_title")}
			</Text>

			{submitSuccess && (
				<Text className="text-center text-green-500 mb-4">
					{t("feedback_success")}
				</Text>
			)}

			{/* Champ Nom */}
			<Controller
				control={control}
				rules={{ required: t("name_required") }}
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="mb-4">
						<TextInput
							className={`border ${
								errors.name ? "border-red-500" : "border-cardBackground"
							} bg-cardBackground rounded-md p-3 text-text`}
							placeholder={t("name")}
							placeholderTextColor={theme.colors.textTertiary}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
						/>
						{errors.name && (
							<Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>
						)}
					</View>
				)}
				name="name"
			/>

			{/* Champ Email */}
			<Controller
				control={control}
				rules={{
					required: t("email_required"),
					pattern: {
						value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
						message: t("email_invalid"),
					},
				}}
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="mb-4">
						<TextInput
							className={`border ${
								errors.email ? "border-red-500" : "border-cardBackground"
							} bg-cardBackground rounded-md p-3 text-text`}
							placeholder={t("email")}
							placeholderTextColor={theme.colors.textTertiary}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							keyboardType="email-address"
						/>
						{errors.email && (
							<Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
						)}
					</View>
				)}
				name="email"
			/>

			{/* Champ Catégorie */}
			<Controller
				control={control}
				rules={{ required: true }}
				render={({ field: { onChange, value } }) => (
					<View className="mb-4">
						<Dropdown
							style={{
								borderColor: errors.category ? "red" : theme.colors.cardBackground,
								backgroundColor: theme.colors.cardBackground,
								borderRadius: 8,
								padding: 12,
							}}
							placeholderStyle={{ color: theme.colors.textTertiary }}
							selectedTextStyle={{ color: theme.colors.text }}
							data={categories}
							labelField="label"
							valueField="value"
							placeholder={t("category")}
							value={value}
							onChange={onChange}
						/>
						{errors.category && (
							<Text className="text-red-500 text-sm mt-1">
								{t("category_required")}
							</Text>
						)}
					</View>
				)}
				name="category"
			/>

			{/* Champ Feedback */}
			<Controller
				control={control}
				rules={{ required: t("feedback_required") }}
				render={({ field: { onChange, onBlur, value } }) => (
					<View className="mb-4">
						<TextInput
							className={`border ${
								errors.feedback ? "border-red-500" : "border-cardBackground"
							} bg-cardBackground rounded-md p-3 text-text h-24`}
							placeholder={t("feedback")}
							placeholderTextColor={theme.colors.textTertiary}
							onBlur={onBlur}
							onChangeText={onChange}
							value={value}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
						{errors.feedback && (
							<Text className="text-red-500 text-sm mt-1">
								{errors.feedback.message}
							</Text>
						)}
					</View>
				)}
				name="feedback"
			/>

			{/* Champ Note */}
			<Controller
				control={control}
				render={({ field: { onChange, value } }) => (
					<View className="mb-4">
						<Text className="text-text mb-1">
							{t("rating")}: {value}
						</Text>
						<Slider
							style={{ width: "100%", height: 40 }}
							minimumValue={1}
							maximumValue={5}
							step={1}
							minimumTrackTintColor={theme.colors.primary}
							maximumTrackTintColor={theme.colors.textTertiary}
							onValueChange={onChange}
							thumbTintColor={theme.colors.primary}
							value={value}
						/>
					</View>
				)}
				name="rating"
			/>

			{/* Bouton de soumission */}
			<Pressable
				className="bg-primary rounded-lg p-3"
				onPress={handleSubmit(onSubmit)}
				style={{ backgroundColor: theme.colors.primary }}
				disabled={isSubmitting}
			>
				<Text
					className="text-center text-textSecondary font-bold"
					style={{
						color: theme.colors.textSecondary,
					}}
				>
					{isSubmitting ? t("submitting") : t("submit")}
				</Text>
			</Pressable>
		</View>
	);
}
