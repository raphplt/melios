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
	setValue, // Ajout de setValue ici
}: {
	register: any;
	isEditingName: boolean;
	setIsEditingName: (value: boolean) => void;
	isEditingDescription: boolean;
	setIsEditingDescription: (value: boolean) => void;
	setFocus: any;
	setValue: any;
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
					onFocus={() => setIsEditingName(true)}
					onBlur={() => setIsEditingName(false)}
					onChangeText={(value) => setValue("name", value)} // Utilisation de setValue
					defaultValue={habit?.name} // Liaison avec la valeur actuelle
				/>
				<Pressable
					onPress={() => toggleFocus("name", isEditingName, setIsEditingName)}
				>
					<EditButton isEditing={isEditingName} />
				</Pressable>
			</View>

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
					onFocus={() => setIsEditingDescription(true)}
					onBlur={() => setIsEditingDescription(false)}
					onChangeText={(value) => setValue("description", value)} // Utilisation de setValue
					value={habit?.description} // Liaison avec la valeur actuelle
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
		</>
	);
}
