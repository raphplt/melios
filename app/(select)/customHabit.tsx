import {
	View,
	Text,
	Pressable,
	ScrollView,
	ActivityIndicator,
	ImageBackground,
	StatusBar,
	Dimensions,
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
import React from "react";
import { useTranslation } from "react-i18next";
import ConfidentialitySelectorHabit from "@components/Select/Items/Confidentiality";
import { catImgs } from "@utils/categoriesBg";
import { StyleSheet } from "react-native";

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
			categoryId: habit?.category?.id || "0",
			color: habit?.category?.color || "#A9A9A9",
			icon: habit?.category?.icon || "smile-beam",
			moment: habit?.moment || 0,
			duration: habit?.duration || 0,
			frequency: frequencyDefaultValues,
			type: habit?.type || "Positif",
			memberId: member?.uid || null,
			habitId: habit?.id || "0",
			reminderMoment: habit?.reminderMoment || 5,
			confidentiality: habit?.confidentiality || "private",
			createAt: new Date(),
		},
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		setFocus,
		setValue,
	} = methods;

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			setIsSubmitting(true);
			// console.log("data", data);
			const newHabit = await setMemberHabit(data);
			setHabits((prev: UserHabit[]) => [...prev, newHabit as UserHabit]);
			navigation.navigate("(navbar)");
		} catch (error) {
			console.error("Erreur lors de la soumission de l'habitude: ", error);
		}
	};

	useEffect(() => {
		return () => {
			setHabit(null);
		};
	}, []);

	const screenHeight = Dimensions.get("screen").height;

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				// paddingTop: 40,
				zIndex: 10,
			}}
		>
			<ImageBackground
				source={catImgs[habit?.category?.slug || "sport"]}
				style={[StyleSheet.absoluteFillObject, { height: screenHeight }]}
			/>
			<View style={{ paddingTop: 30 }}>
				<ButtonClose />
			</View>
			<FormProvider {...methods}>
				<View className="w-[95%] mx-auto flex flex-col items-center gap-1 z-10">
					{/* TITRE */}
					<HabitTitle
						register={register}
						isEditingName={isEditingName}
						setIsEditingName={setIsEditingName}
						isEditingDescription={isEditingDescription}
						setIsEditingDescription={setIsEditingDescription}
						setFocus={setFocus}
						setValue={setValue}
						errors={errors}
					/>

					{/* INFORMATIONS */}
					<HabitInfos habit={habit} setValue={setValue} />
					{/* HEURE */}
					<HabitMoment register={register} setValue={setValue} />
					{errors.moment && (
						<Text style={{ color: "red" }}>{errors.moment.message}</Text>
					)}

					{/* RÉPÉTER */}
					<RepeatHabit register={register} setValue={setValue} />
					{errors.frequency && (
						<Text style={{ color: "red" }}>{errors.frequency.message}</Text>
					)}

					{/* NOTIFICATIONS */}
					<Notifications setValue={setValue} />
					{errors.reminderMoment && (
						<Text style={{ color: "red" }}>{errors.reminderMoment.message}</Text>
					)}
					{errors.category && (
						<Text style={{ color: "red" }}>{errors.category.message}</Text>
					)}

					{/* CONFIDENTIALITÉ */}
					<ConfidentialitySelectorHabit
						value={methods.watch("confidentiality")}
						onChange={(value) => setValue("confidentiality", value)}
					/>
				</View>
			</FormProvider>
			<Pressable
				style={{
					backgroundColor: theme.colors.primary,
				}}
				onPress={handleSubmit(onSubmit)}
				className="rounded-xl flex flex-row items-center justify-center absolute bottom-4 left-5 right-5 p-4 z-10"
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
		</ScrollView>
	);
}