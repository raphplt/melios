import { Ionicons } from "@expo/vector-icons";
import { Pressable, TextInput, View } from "react-native";
import { Iconify } from "react-native-iconify";

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
			className="flex flex-row items-center justify-between rounded-3xl w-3/4 px-2 py-2 mx-1"
			style={{
				backgroundColor: theme.colors.cardBackground,
			}}
		>
			<View className="flex flex-row items-center">
				<Iconify
					icon="material-symbols:search"
					size={20}
					color={theme.colors.textTertiary}
				/>
				<TextInput
					style={{
						color: theme.colors.text,
					}}
					onChangeText={(text) => setSearch(text)}
					value={search}
					placeholder="Rechercher une habitude"
					className="ml-1"
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
