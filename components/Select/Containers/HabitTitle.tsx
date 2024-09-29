import EditButton from "@components/Shared/EditButton";
import { View, TextInput, Pressable, Keyboard } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";

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

	// Fonction pour basculer le focus du champ TextInput correspondant
	const toggleFocus = (
		fieldName: string,
		isEditing: boolean,
		setEditing: (value: boolean) => void
	) => {
		if (isEditing) {
			Keyboard.dismiss(); // Fermer le clavier
			setEditing(false);
		} else {
			setFocus(fieldName); // Mettre le focus sur le TextInput
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
			<View
				style={{
					backgroundColor: theme.colors.background,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				className="rounded-xl px-3 py-1 mt-4 flex flex-row items-center justify-between"
			>
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					className="w-10/12"
					placeholder={"Description"}
					{...register("description")}
					defaultValue={habit?.description}
					onFocus={() => setIsEditingDescription(true)}
					onBlur={() => setIsEditingDescription(false)}
					multiline={true}
					numberOfLines={3}
				/>
				<Pressable
					onPress={() =>
						toggleFocus("description", isEditingDescription, setIsEditingDescription)
					}
				>
					<EditButton isEditing={isEditingDescription} />
				</Pressable>
			</View>
		</>
	);
}
