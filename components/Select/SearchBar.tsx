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
			className="flex flex-row items-center justify-between rounded-3xl w-3/4 px-2 py-1 mx-1"
			style={{
				backgroundColor: theme.colors.cardBackground,
				borderColor: theme.colors.primary,
				borderWidth: 1,
			}}
		>
			<View className="flex flex-row items-center">
				<Ionicons
					name="search"
					size={24}
					style={{ color: theme.colors.primary, marginRight: 10 }}
				/>
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					onChangeText={(text) => setSearch(text)}
					value={search}
					placeholder="Rechercher une habitude"
					placeholderTextColor={theme.colors.text}
				/>
			</View>
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
