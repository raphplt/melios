import {
	View,
	Text,
	StatusBar,
	Pressable,
	TextInput,
	Keyboard,
} from "react-native";
import { Iconify } from "react-native-iconify";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import HabitHour from "@components/Select/Containers/HabitHour";
import HabitInfos from "@components/Select/Containers/HabitInfos";
import Notifications from "@components/Select/Items/Notifications";
import RepeatHabit from "@components/Select/Items/RepeatHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { createHabitSchema } from "@utils/schemas/createHabit.schema";
import HabitTitle from "@components/Select/Containers/HabitTitle";

export default function CustomHabit() {
	const { theme } = useTheme();
	const { habit } = useSelect();

	const methods = useForm({
		resolver: zodResolver(createHabitSchema),
		mode: "onSubmit",
		defaultValues: {
			name: habit?.name || "",
			description: habit?.description || "",
			difficulty: habit?.difficulty || 1,
			category: habit?.category.category || "",
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

	// Fonction de soumission du formulaire
	const onSubmit = (data: any) => {
		console.log("data on submit", data);
	};

	console.log("errors", errors);

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
					<HabitHour habit={habit} />

					{/* RÉPÉTER */}
					<RepeatHabit habit={habit} />

					{/* NOTIFICATIONS */}
					<Notifications habit={habit} />

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
