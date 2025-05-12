import EditButton from "@components/Shared/EditButton";
import { View, TextInput, Pressable, Keyboard, Text } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function HabitTitle({
	register,
	isEditingName,
	setIsEditingName,
	isEditingDescription,
	setIsEditingDescription,
	setFocus,
	setValue,
	errors,
	currentHabitName,
	currentHabitDescription,
}: {
	register: any;
	isEditingName: boolean;
	setIsEditingName: (value: boolean) => void;
	isEditingDescription: boolean;
	setIsEditingDescription: (value: boolean) => void;
	setFocus: any;
	setValue: any;
	errors: any;
	currentHabitName?: string;
	currentHabitDescription?: string;
}) {
	const { theme } = useTheme();
	const { habit } = useSelect();
	const { t } = useTranslation();

	// Use currentHabitName and currentHabitDescription if provided (for edit mode)
	// otherwise fallback to habit from context (for create mode)
	const nameToDisplay = currentHabitName || habit?.name || "";
	const descriptionToDisplay =
		currentHabitDescription || habit?.description || "";

	// Set the values when component mounts to ensure fields display current values
	useEffect(() => {
		if (currentHabitName) {
			setValue("name", currentHabitName);
		}
		if (currentHabitDescription) {
			setValue("description", currentHabitDescription);
		}
	}, [currentHabitName, currentHabitDescription, setValue]);

	const toggleFocus = (
		fieldName: string,
		isEditing: boolean,
		setEditing: (value: boolean) => void
	) => {
		if (isEditing) {
			Keyboard.dismiss();
			setEditing(false);
		} else {
			setFocus(fieldName);
			setEditing(true);
		}
	};

	return (
		<>
			<View className="flex flex-row items-center justify-between w-[95%] mx-auto">
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					className="text-2xl font-semibold w-10/12"
					placeholder={t("habit_name")}
					placeholderTextColor={theme.colors.textTertiary}
					{...register("name")}
					onFocus={() => setIsEditingName(true)}
					onBlur={() => setIsEditingName(false)}
					onChangeText={(value) => setValue("name", value)}
					defaultValue={nameToDisplay}
				/>
				<Pressable
					onPress={() => toggleFocus("name", isEditingName, setIsEditingName)}
				>
					<EditButton isEditing={isEditingName} />
				</Pressable>
			</View>
			{errors.name && <Text style={{ color: "red" }}>{errors.name.message}</Text>}

			<View
				className="rounded-lg px-4 py-2 pb-3 mt-4 flex flex-row items-center justify-between w-full mx-auto"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					className="w-10/12"
					placeholder={t("set_a_description")}
					{...register("description")}
					onFocus={() => setIsEditingDescription(true)}
					onBlur={() => setIsEditingDescription(false)}
					onChangeText={(value) => setValue("description", value)}
					placeholderTextColor={theme.colors.textTertiary}
					defaultValue={descriptionToDisplay}
					multiline={true}
					numberOfLines={2}
					cursorColor={theme.colors.textTertiary}
				/>
				<Pressable
					onPress={() =>
						toggleFocus("description", isEditingDescription, setIsEditingDescription)
					}
				/>

				{errors.description && (
					<Text style={{ color: "red" }}>{errors.description.message}</Text>
				)}
			</View>
		</>
	);
}