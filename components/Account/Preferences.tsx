import { ThemeContext } from "@context/ThemeContext";
import { useContext, useState } from "react";
import AccountBlock from "./AccountBlock";
import { View, Text, Modal, Button, Pressable } from "react-native";
import RowBlock from "./RowBlock";
import { Iconify } from "react-native-iconify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ToggleButton from "./Switch";
import useNotifications from "@hooks/useNotifications";
import { useData } from "@context/DataContext";
import { disconnectUser } from "@db/users";

export default function Preferences() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const {
		setHabits,
		setUncompletedHabitsData,
		setCompletedHabitsData,
		setPoints,
		setNotificationToggle,
		notificationToggle,
	} = useData();

	const { scheduleDailyNotification, cancelAllNotifications } =
		useNotifications();

	const [modalVisible, setModalVisible] = useState(false);

	const handleToggleTheme = async () => {
		toggleTheme();
		const newTheme = !isDarkTheme;
		setIsDarkTheme(newTheme);
		await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
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

	const confirmLogout = async () => {
		setHabits([]);
		setUncompletedHabitsData([]);
		setCompletedHabitsData([]);
		setPoints({ odyssee: 0, rewards: 0 });

		await disconnectUser();
		setModalVisible(false);
	};

	const handleLogout = () => {
		setModalVisible(true);
	};

	return (
		<AccountBlock title="Préférences">
			<RowBlock
				icon={<Iconify icon="ph:moon" size={24} color={theme.colors.text} />}
				title="Mode sombre"
				rightContent={
					<ToggleButton onToggle={handleToggleTheme} value={isDarkTheme} />
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				icon={
					<Iconify icon="mdi:bell-outline" size={24} color={theme.colors.text} />
				}
				title="Notifications"
				rightContent={
					<ToggleButton
						title="Notifications"
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Langue"
				icon={<Iconify icon="mdi:earth" size={24} color={theme.colors.text} />}
				rightContent={<Text style={{ color: theme.colors.text }}>Français</Text>}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>

			<RowBlock
				title="Aide"
				icon={<Iconify icon="zondicons:buoy" size={22} color={theme.colors.text} />}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>
			<RowBlock
				title="À propos"
				icon={
					<Iconify icon="mdi:information" size={24} color={theme.colors.text} />
				}
				rightContent={
					<Iconify icon="ion:chevron-forward" size={20} color={theme.colors.text} />
				}
			/>
			<View className="w-full my-3 h-[1px] bg-gray-300"></View>
			<RowBlock
				title="Déconnexion"
				onPress={handleLogout}
				icon={<Iconify icon="mdi:logout" size={22} color={theme.colors.text} />}
			/>

			<Modal
				animationType="none"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<View
						style={{
							margin: 20,
							backgroundColor: theme.colors.background,
							alignItems: "center",
							shadowColor: "#000",
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.25,
							shadowRadius: 4,
							elevation: 5,
						}}
						className="rounded-xl p-12"
					>
						<Text className="text-center text-[16px] mb-4 w-full">
							Voulez-vous vraiment vous déconnecter?
						</Text>
						<View className="flex flex-row">
							<Pressable
								onPress={() => setModalVisible(!modalVisible)}
								className="rounded-lg px-8 py-3"
								style={{
									backgroundColor: theme.colors.cardBackground,
								}}
							>
								<Text
									style={{
										color: theme.colors.text,
									}}
									className=" font-bold"
								>
									Annuler
								</Text>
							</Pressable>
							<Pressable
								onPress={confirmLogout}
								style={{
									backgroundColor: theme.colors.redSecondary,
								}}
								className="rounded-lg px-5 py-3 ml-4"
							>
								<Text
									style={{
										color: theme.colors.redPrimary,
									}}
									className=" font-bold"
								>
									Confirmer
								</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</AccountBlock>
	);
}