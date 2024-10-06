import EditButton from "@components/Shared/EditButton";
import { View, TextInput, Pressable, Keyboard } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { BlurView } from "expo-blur";

export default function HabitTitle({
	register,
	isEditingName,
	setIsEditingName,
	isEditingDescription,
	setIsEditingDescription,
	setFocus,
}: {
	register: any;
	isEditingName: boolean;
	setIsEditingName: (value: boolean) => void;
	isEditingDescription: boolean;
	setIsEditingDescription: (value: boolean) => void;
	setFocus: any;
}) {
	const { theme } = useTheme();
	const { habit } = useSelect();

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
			<View className="flex flex-row items-center justify-between">
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					className="text-2xl font-semibold w-10/12"
					placeholder={"Nom de l'habitude"}
					{...register("name")}
					defaultValue={habit?.name}
					onFocus={() => setIsEditingName(true)}
					onBlur={() => setIsEditingName(false)}
				/>
				<Pressable
					onPress={() => toggleFocus("name", isEditingName, setIsEditingName)}
				>
					<EditButton isEditing={isEditingName} />
				</Pressable>
			</View>

			{/* Input Description avec icône d'édition */}
			{/* <View
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				className="rounded-xl px-3 py-1 mt-4 flex flex-row items-center justify-between"
			> */}
			<BlurView
				intensity={90}
				className="rounded-xl px-3 py-1 mt-4 flex flex-row items-center justify-between"
				style={{
					overflow: "hidden",
				}}
			>
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					className="w-10/12 font-semibold"
					placeholder={"Description"}
					{...register("description")}
					defaultValue={habit?.description}
					onFocus={() => setIsEditingDescription(true)}
					onBlur={() => setIsEditingDescription(false)}
					multiline={true}
					numberOfLines={3}
					cursorColor={theme.colors.textTertiary}
				/>
				<Pressable
					onPress={() =>
						toggleFocus("description", isEditingDescription, setIsEditingDescription)
					}
				>
					<EditButton isEditing={isEditingDescription} />
				</Pressable>
			</BlurView>
			{/* </View> */}
		</>
	);
}
