import { Button, Pressable } from "react-native";

import { Text, View } from "../../components/Themed";
import { useContext, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import ToggleButton from "../../components/Switch";

export default function TabTwoScreen() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);

	const handleToggleTheme = () => {
		toggleTheme();
		setIsDarkTheme((prevState) => !prevState);
	};
	return (
		<View
			className="h-[100vh]"
			style={{ backgroundColor: theme.colors.background }}
		>
			<Text
				className=" ml-6 mb-4 text-xl mt-3"
				style={{ color: theme.colors.text }}
			>
				_username_
			</Text>
			<View />
			<View
				className="w-11/12 mx-auto"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ToggleButton
					title="Mode sombre"
					onToggle={handleToggleTheme}
					value={isDarkTheme}
				/>
			</View>
		</View>
		// </ThemeProvider>
	);
}
