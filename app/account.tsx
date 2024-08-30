import { useContext, useState } from "react";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Version from "@components/Account/Version";
import ToggleList from "@components/Account/ToggleList";
import MemberInfos from "@components/Account/MemberInfos";
import LoaderScreen from "@components/Shared/LoaderScreen";
import LogoutButton from "@components/Account/LogoutButton";
import UserInfos from "@components/Account/UserInfos";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { auth } from "@db/index";
import { disconnectUser } from "@db/users";
import useNotifications from "@hooks/useNotifications";
import General from "@components/Account/General";
import Preferences from "@components/Account/Preferences";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);

	const {
		setHabits,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		setPoints,
		setNotificationToggle,
		member,
		isLoading,
	} = useData();

	const { scheduleDailyNotification, cancelAllNotifications } =
		useNotifications();

	const handleToggleTheme = async () => {
		toggleTheme();
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
	};

	const handleLogout = async () => {
		setHabits([]);
		setUncompletedHabitsData([]);
		setCompletedHabitsData([]);
		setPoints({ odyssee: 0, rewards: 0 });

		await disconnectUser();
	};

	const handleToggleNotifications = async () => {
		const notificationEnabled = await AsyncStorage.getItem("notificationEnabled");
		if (notificationEnabled === "true") {
			await AsyncStorage.setItem("notificationEnabled", "false");
			await cancelAllNotifications();
			setNotificationToggle(false);
		} else {
			await AsyncStorage.setItem("notificationEnabled", "true");
			await scheduleDailyNotification();
			setNotificationToggle(true);
		}
	};

	if (isLoading) return <LoaderScreen text="Chargement du profil" />;

	return (
		<>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: theme.colors.background }}
			>
				<MemberInfos member={member} auth={auth} />
				<General />
				<Preferences />

				<Version />
			</ScrollView>
		</>
	);
}
