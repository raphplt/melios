import { View, Text } from "react-native";
import ToggleButton from "./Switch";

export default function ToggleList({
	isDarkTheme,
	handleToggleTheme,
	notificationToggle,
	handleToggleNotifications,
	theme,
}: {
	isDarkTheme: boolean;
	handleToggleTheme: () => void;
	notificationToggle: boolean;
	handleToggleNotifications: () => void;
	theme: any;
}) {
	return (
		<View
			className="p-4 mb-6 w-[95%] mx-auto rounded-xl"
			style={{ backgroundColor: theme.colors.textSecondary }}
		>
			<View className="flex w-full font-semibold mx-auto mb-4 flex-row items-center ">
				<Text
					className=" text-lg font-semibold ml-3"
					style={{ color: theme.colors.text }}
				>
					Paramètres généraux
				</Text>
			</View>
			<View
				className="p-4 rounded-lg shadow-md mb-4"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ToggleButton
					title="Mode sombre"
					onToggle={handleToggleTheme}
					value={isDarkTheme}
				/>
				<ToggleButton
					title="Notifications"
					onToggle={handleToggleNotifications}
					value={notificationToggle}
				/>
			</View>
		</View>
	);
}
