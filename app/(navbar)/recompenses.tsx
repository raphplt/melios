import { FlatList } from "react-native";
import { useTheme } from "@context/ThemeContext";
import MarketPacks from "@components/Recompenses/MarketPacks";
import CosmeticPreview from "@components/Recompenses/CosmeticPreview";

export default function Recompenses() {
	const { theme } = useTheme();

	const components = [
		{ key: "cosmeticPreview", component: <CosmeticPreview /> },
		{ key: "marketPacks", component: <MarketPacks /> },
	];

	return (
		<FlatList
			data={components}
			renderItem={({ item }) => item.component}
			keyExtractor={(item) => item.key}
			style={{
				backgroundColor: theme.colors.background,
			}}
			showsVerticalScrollIndicator={false}
		/>
	);
}
