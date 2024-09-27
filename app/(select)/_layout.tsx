import { SelectProvider } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { Tabs } from "expo-router";
import { StatusBar } from "react-native";

const SelectLayout = () => {
	const { theme } = useTheme();
	return (
		<SelectProvider>
			<StatusBar
				barStyle={theme.dark ? "light-content" : "dark-content"}
				backgroundColor={"transparent"}
			/>
			<Tabs
				screenOptions={{
					tabBarStyle: {
						display: "none",
					},
				}}
			>
				<Tabs.Screen name="index" options={{ headerShown: false }} />
				<Tabs.Screen name="categoryList" options={{ headerShown: false }} />
			</Tabs>
		</SelectProvider>
	);
};

export default SelectLayout;
