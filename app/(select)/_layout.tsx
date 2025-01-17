import { SelectProvider } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { Stack, Tabs } from "expo-router";
import { StatusBar } from "react-native";

const SelectLayout = () => {
	const { theme } = useTheme();
	return (
		<SelectProvider>
			<StatusBar
				barStyle={theme.dark ? "light-content" : "dark-content"}
				backgroundColor={"transparent"}
			/>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="habitsList" options={{ headerShown: false }} />
				<Stack.Screen name="customHabit" options={{ headerShown: false }} />
			</Stack>
		</SelectProvider>
	);
};

export default SelectLayout;
