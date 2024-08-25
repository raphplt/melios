import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { onAuthStateChanged } from "firebase/auth";
import { ScrollView } from "react-native";
import { ThemeProvider, useNavigation } from "@react-navigation/native";
import { disconnectUser } from "../db/users";
import { auth } from "../db";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "../context/DataContext";
import notifications from "../hooks/useNotifications";
import LogoutButton from "../components/Account/LogoutButton";
import UserInfos from "../components/Account/UserInfos";
import LoginView from "../components/Account/LoginView";
import Version from "@components/Account/Version";
import ToggleList from "@components/Account/ToggleList";
import MemberInfos from "@components/Account/MemberInfos";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);

	const [isSignedIn, setIsSignedIn] = useState(false);
	const {
		setHabits,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		setPoints,
		notificationToggle,
		setNotificationToggle,
		member,
	} = useData();
	const { scheduleDailyNotification, cancelAllNotifications } = notifications();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsSignedIn(!!user);
		});

		return () => unsubscribe();
	}, []);

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

	const navigation: any = useNavigation();

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

	return (
		<>
			<ThemeProvider value={theme}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					style={{ backgroundColor: theme.colors.background }}
				>
					{isSignedIn ? (
						<MemberInfos member={member} auth={auth} theme={theme} />
					) : (
						<LoginView theme={theme} navigation={navigation} />
					)}
					<ToggleList
						isDarkTheme={isDarkTheme}
						handleToggleTheme={handleToggleTheme}
						notificationToggle={notificationToggle}
						handleToggleNotifications={handleToggleNotifications}
						theme={theme}
					/>
					{member && Object.keys(member).length > 0 && <UserInfos member={member} />}
					<LogoutButton handleLogout={handleLogout} theme={theme} />
					<Version />
				</ScrollView>
			</ThemeProvider>
		</>
	);
}
