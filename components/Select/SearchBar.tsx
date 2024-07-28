import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";

export default function SearchBar({
	search,
	setSearch,
	theme,
}: {
	search: string;
	setSearch: (text: string) => void;
	theme: any;
}) {
	return (
		<View
			className="flex flex-row items-center w-11/12 mx-auto rounded-3xl  px-3 mt-2"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.primary,
				borderWidth: 1,
			}}
		>
			<Ionicons
				name="search"
				size={24}
				style={{ color: theme.colors.primary, marginRight: 10 }}
			/>
			<TextInput
				style={{ flex: 1, height: 40, color: theme.colors.text }}
				onChangeText={(text) => setSearch(text)}
				value={search}
				placeholder="Rechercher une habitude"
			/>
			{search.length > 0 && (
				<Pressable onPress={() => setSearch("")}>
					<Ionicons
						name="close-circle"
						size={24}
						style={{ color: theme.colors.text }}
					/>
				</Pressable>
			)}
		</View>
	);
}
