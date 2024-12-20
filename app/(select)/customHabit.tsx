import {
	View,
	Text,
	StatusBar,
	Pressable,
	StyleSheet,
	ScrollView,
	Platform,
	ActivityIndicator,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
	useForm,
	FormProvider,
	FieldValues,
	SubmitHandler,
} from "react-hook-form";

import HabitMoment from "@components/Select/Containers/HabitMoment";
import HabitInfos from "@components/Select/Containers/HabitInfos";
import Notifications from "@components/Select/Items/Notifications";
import RepeatHabit from "@components/Select/Items/RepeatHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import {
	createHabitSchema,
	frequencyDefaultValues,
} from "@utils/schemas/createHabit.schema";
import HabitTitle from "@components/Select/Containers/HabitTitle";
import { useData } from "@context/DataContext";
import { setMemberHabit } from "@db/userHabit";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { UserHabit } from "@type/userHabit";
import { LinearGradient } from "expo-linear-gradient";
import { lightenColor } from "@utils/colors";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CustomHabit() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { theme } = useTheme();
	const { habit, setHabit } = useSelect();
	const { member, setHabits } = useData();
	const { t } = useTranslation();

	const methods = useForm({
		resolver: zodResolver(createHabitSchema),
		mode: "onSubmit",
		defaultValues: {
			name: habit?.name || "",
			description: habit?.description || "",
			difficulty: habit?.difficulty || 1,
			category: habit?.category?.category || "Personnalisé",
			color: habit?.category?.color || "#A9A9A9",
			icon: habit?.category?.icon || "smile-beam",
			moment: habit?.moment || 0,
			duration: habit?.duration || 0,
			frequency: frequencyDefaultValues,
			memberId: member?.uid || null,
			habitId: habit?.id || "0",
			reminderMoment: habit?.reminderMoment || 5,
		},
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		watch,
		setFocus,
		setValue,
		getValues,
	} = methods;

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fonction de soumission du formulaire
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			setIsSubmitting(true);
			const newHabit = await setMemberHabit(data);
			setHabits((prev: UserHabit[]) => [...prev, newHabit as UserHabit]);
			navigation.navigate("(navbar)");
		} catch (error) {
			console.error("Erreur lors de la soumission de l'habitude: ", error);
		}
	};

	// Selected color
	const selectedColor = watch("color");
	const gradientColors = habit
		? [lightenColor(selectedColor, 0.8), lightenColor(selectedColor, 0.6)]
		: [lightenColor("#08209F", 0.4), theme.colors.cardBackground];

	// Remove habit on back
	useEffect(() => {
		return () => {
			setHabit(null);
		};
	}, []);

	return (
		<>
			<View style={{ flex: 1 }}>
				<ScrollView
					contentContainerStyle={{
						flexGrow: 1,
						paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
					}}
				>
					<LinearGradient
						colors={gradientColors}
						style={{
							flex: 1,
							...StyleSheet.absoluteFillObject,
							overflow: "hidden",
						}}
					/>
					<ButtonClose />
					<FormProvider {...methods}>
						<View className="w-11/12 mx-auto pb-10">
							{/* TITRE */}
							<HabitTitle
								register={register}
								isEditingName={isEditingName}
								setIsEditingName={setIsEditingName}
								isEditingDescription={isEditingDescription}
								setIsEditingDescription={setIsEditingDescription}
								setFocus={setFocus}
								setValue={setValue}
								selectedColor={selectedColor}
							/>
							{errors.name && (
								<Text style={{ color: "red" }}>{errors.name.message}</Text>
							)}
							{errors.description && (
								<Text style={{ color: "red" }}>{errors.description.message}</Text>
							)}

							{/* INFORMATIONS */}
							<HabitInfos habit={habit} register={register} setValue={setValue} />
							{/* HEURE */}
							<HabitMoment register={register} setValue={setValue} />
							{errors.moment && (
								<Text style={{ color: "red" }}>{errors.moment.message}</Text>
							)}

							{/* RÉPÉTER */}
							<RepeatHabit
								register={register}
								setValue={setValue}
								getValues={getValues}
							/>
							{errors.frequency && (
								<Text style={{ color: "red" }}>{errors.frequency.message}</Text>
							)}

							{/* NOTIFICATIONS */}
							<Notifications register={register} setValue={setValue} />
							{errors.reminderMoment && (
								<Text style={{ color: "red" }}>{errors.reminderMoment.message}</Text>
							)}
							{errors.category && (
								<Text style={{ color: "red" }}>{errors.category.message}</Text>
							)}
						</View>
						
					</FormProvider>
				</ScrollView>
				<Pressable
					style={{
						backgroundColor: theme.colors.primary,
					}}
					onPress={handleSubmit(onSubmit)}
					className="rounded-2xl flex flex-row items-center justify-center absolute bottom-5 left-5 right-5 p-4"
				>
					{isSubmitting ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text
							style={{
								color: "white",
							}}
							className="text-lg"
						>
							{t("save")}
						</Text>
					)}
				</Pressable>
			</View>
		</>
	);
}
