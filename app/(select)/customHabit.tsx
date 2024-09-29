import { View, Text, StatusBar, Pressable } from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
	useForm,
	FormProvider,
	FieldValues,
	set,
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

export default function CustomHabit() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const { theme } = useTheme();
	const { habit } = useSelect();
	const { member } = useData();
	const methods = useForm({
		resolver: zodResolver(createHabitSchema),
		mode: "onSubmit",
		defaultValues: {
			name: habit?.name || "",
			description: habit?.description || "",
			difficulty: habit?.difficulty || 1,
			category: habit?.category.category || "",
			moment: habit?.moment || 0,
			frequency: frequencyDefaultValues,
			memberId: member?.uid || null,
			habitId: habit?.id || null,
		},
	});

	const {
		handleSubmit,
		register,
		formState: { errors },
		setFocus,
		setValue,
		getValues,
	} = methods;

	const [isEditingName, setIsEditingName] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);

	// Fonction de soumission du formulaire
	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		// console.log("data on submit", data);
		setMemberHabit(data);
		navigation.navigate("(navbar)");
	};

	// console.log("errors", errors);
	// console.log("habit", habit);

	return (
		<View
			style={{
				flex: 1,
				paddingTop: StatusBar.currentHeight,
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<ButtonClose />
			<FormProvider {...methods}>
				<View className="w-11/12 mx-auto">
					{/* TITRE */}
					<HabitTitle
						register={register}
						isEditingName={isEditingName}
						setIsEditingName={setIsEditingName}
						isEditingDescription={isEditingDescription}
						setIsEditingDescription={setIsEditingDescription}
						setFocus={setFocus}
					/>

					{/* INFORMATIONS */}
					<HabitInfos habit={habit} register={register} setValue={setValue} />

					{/* HEURE */}
					<HabitMoment register={register} setValue={setValue} />

					{/* RÉPÉTER */}
					<RepeatHabit
						register={register}
						setValue={setValue}
						getValues={getValues}
					/>

					{/* NOTIFICATIONS */}
					<Notifications register={register} setValue={setValue} />

					<Pressable
						style={{
							backgroundColor: theme.colors.primary,
						}}
						onPress={handleSubmit(onSubmit)}
						className="rounded-xl py-3 mt-4 flex flex-row items-center justify-center"
					>
						<Text
							style={{
								color: "white",
							}}
							className="text-lg"
						>
							Enregistrer
						</Text>
					</Pressable>
				</View>
			</FormProvider>
		</View>
	);
}
