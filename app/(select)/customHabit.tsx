import { View, Text, StatusBar, Pressable, TextInput } from "react-native";
import { Iconify } from "react-native-iconify";
import { zodResolver } from "@hookform/resolvers/zod";

import HabitHour from "@components/Select/Containers/HabitHour";
import HabitInfos from "@components/Select/Containers/HabitInfos";
import Notifications from "@components/Select/Items/Notifications";
import RepeatHabit from "@components/Select/Items/RepeatHabit";
import ButtonClose from "@components/Shared/ButtonClose";
import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { FormProvider, useForm } from "react-hook-form";
import { createHabitSchema } from "@utils/schemas/createHabit.schema";

export default function CustomHabit() {
	const { theme } = useTheme();
	const { habit } = useSelect();

	// console.log(habit);
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
	} = methods;

	// Function to handle the form submission
	const onSubmit = (data: any) => {
		console.log("data", data);
	};

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
					<View className="flex flex-row items-center justify-between ">
						<TextInput
							style={{
								color: theme.colors.text,
							}}
							className="text-2xl font-semibold w-10/12"
							value={habit?.name}
							placeholder={ "Nom de l'habitude"}
							{...register("name")}
						/>
						<Iconify
							icon="material-symbols:edit"
							size={24}
							color={theme.colors.text}
						/>
					</View>
					{/* <Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-lg mt-1"
				>
					{habit?.category.category || null}
				</Text> */}
					<View
						style={{
							backgroundColor: theme.colors.background,
						}}
						className="rounded-xl p-3 mt-4 flex flex-row items-center justify-between"
					>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="w-10/12"
						>
							{habit?.description}
						</Text>
						<Iconify icon="lucide:edit" size={22} color={theme.colors.text} />
					</View>

					{/* INFORMATIONS */}
					<HabitInfos habit={habit} />

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
