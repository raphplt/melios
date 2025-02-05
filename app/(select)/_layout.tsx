import { SelectProvider } from "@context/SelectContext";
import { Stack, Tabs } from "expo-router";

const SelectLayout = () => {
	return (
		<SelectProvider>
			<Stack>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="habitsList" options={{ headerShown: false }} />
				<Stack.Screen name="customHabit" options={{ headerShown: false }} />
				<Stack.Screen name="customRoutine" options={{ headerShown: false }} />
			</Stack>
		</SelectProvider>
	);
};

export default SelectLayout;
