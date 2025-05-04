import {
	View,
	Text,
	Pressable,
	ScrollView,
	ActivityIndicator,
	ImageBackground,
	Dimensions,
	Alert,
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
import { useTheme } from "@context/ThemeContext";
import {
	createHabitSchema,
	frequencyDefaultValues,
} from "@utils/schemas/createHabit.schema";
import { StyleSheet } from "react-native";
import HabitTitle from "@components/Select/Containers/HabitTitle";
import { useData } from "@context/DataContext";
import { updateMemberHabit } from "@db/userHabit";
import {
	NavigationProp,
	ParamListBase,
	useRoute,
} from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { UserHabit } from "@type/userHabit";
import React from "react";
import { useTranslation } from "react-i18next";
import ConfidentialitySelectorHabit from "@components/Select/Items/Confidentiality";
import { catImgs } from "@utils/categoriesBg";
import { Habit } from "@type/habit";

export default function EditHabit() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const route = useRoute();
	const { habitId } = route.params as { habitId: string };

	const { theme } = useTheme();
	const { member, habits, setHabits } = useData();
	const { t } = useTranslation();

	const [currentHabit, setCurrentHabit] = useState<UserHabit | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	console.log("currentHabit", currentHabit);

	useEffect(() => {
		// Find the habit to edit from the habits list
		if (habitId && habits.length > 0) {
			const habitToEdit = habits.find((h) => h.id === habitId);
			if (habitToEdit) {
				setCurrentHabit(habitToEdit);
			} else {
				Alert.alert(t("error"), t("habit_not_found"));
				navigation.navigate("(navbar)");
			}
		}
		setIsLoading(false);
	}, [habitId, habits]);

	const methods = useForm({
		resolver: zodResolver(createHabitSchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
			description: "",
			difficulty: 1,
			category: "Personnalisé",
			categoryId: "0",
			color: "#A9A9A9",
			icon: "smile-beam",
			moment: 0,
			duration: 0,
			frequency: frequencyDefaultValues,
			type: "Positif",
			memberId: member?.uid || null,
			habitId: habitId || "0",
			reminderMoment: 5,
			confidentiality: "private" as "public" | "private" | "friends",
		},
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		setFocus,
		setValue,
		reset,
	} = methods;

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Set form values when current habit data is available
	useEffect(() => {
		if (currentHabit) {
			reset({
				name: currentHabit.name || "",
				description: currentHabit.description || "",
				difficulty: currentHabit.difficulty || 1,
				category: currentHabit.category || "Personnalisé",
				categoryId: currentHabit.id || "0",
				color: currentHabit.color || "#A9A9A9",
				icon: currentHabit.icon || "smile-beam",
				moment: currentHabit.moment || 0,
				duration: currentHabit.duration || 0,
				frequency: currentHabit.frequency || frequencyDefaultValues,
				type: currentHabit.type || "Positif",
				memberId: member?.uid || null,
				habitId: currentHabit.id || "0",
				reminderMoment: currentHabit.reminderMoment || 5,
				confidentiality: currentHabit.confidentiality || "private",
			});
		}
	}, [currentHabit]);

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			setIsSubmitting(true);
			const updatedHabit = await updateMemberHabit(data);

			// Update the habit in the habits list
			setHabits((prev: UserHabit[]) =>
				prev.map((h) => (h.id === habitId ? (updatedHabit as UserHabit) : h))
			);

			Alert.alert(t("success"), t("habit_updated_successfully"), [
				{ text: "OK", onPress: () => navigation.navigate("(navbar)") },
			]);
		} catch (error) {
			console.error("Error updating habit: ", error);
			Alert.alert(t("error"), t("error_updating_habit"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteHabit = () => {
		Alert.alert(t("delete_habit"), t("delete_habit_confirmation"), [
			{
				text: t("cancel"),
				style: "cancel",
			},
			{
				text: t("delete"),
				style: "destructive",
				onPress: async () => {
					try {
						// Implement your delete function in the database
						// await deleteMemberHabit(habitId);

						// Update habits state by removing the deleted habit
						setHabits((prev: UserHabit[]) => prev.filter((h) => h.id !== habitId));

						navigation.navigate("(navbar)");
					} catch (error) {
						console.error("Error deleting habit: ", error);
						Alert.alert(t("error"), t("error_deleting_habit"));
					}
				},
			},
		]);
	};

	if (isLoading || !currentHabit) {
		return (
			<View className="flex-1 items-center justify-center">
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	const screenHeight = Dimensions.get("screen").height;
	const categorySlug =
		currentHabit?.category?.toString().toLowerCase() || "sport";

	return (
		<ScrollView
			contentContainerStyle={{
				flexGrow: 1,
				zIndex: 10,
			}}
		>
			<ImageBackground
				source={catImgs[categorySlug] || catImgs.sport}
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
					<HabitInfos habit={currentHabit as any} setValue={setValue} />

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

			{/* Save Button */}
			<Pressable
				style={{
					backgroundColor: theme.colors.primary,
				}}
				onPress={handleSubmit(onSubmit)}
				className="rounded-xl flex flex-row items-center justify-center mb-16 mx-5 p-4 z-10 mt-4"
			>
				{isSubmitting ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<Text style={{ color: "white" }} className="text-lg">
						{t("save_changes")}
					</Text>
				)}
			</Pressable>

			{/* Delete Button */}
			<Pressable
				style={{
					backgroundColor: theme.colors.redPrimary || "#FF3B30",
				}}
				onPress={handleDeleteHabit}
				className="rounded-xl flex flex-row items-center justify-center absolute bottom-4 left-5 right-5 p-4 z-10"
			>
				<Text style={{ color: "white" }} className="text-lg">
					{t("delete_habit")}
				</Text>
			</Pressable>
		</ScrollView>
	);
}
