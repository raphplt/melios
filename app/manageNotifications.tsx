import React, { useState, useEffect } from "react";
import {
	SafeAreaView,
	ScrollView,
	View,
	Text,
	TextInput,
	Pressable,
	Animated,
} from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import ToggleButton from "@components/Account/Switch";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import useNotifications from "@hooks/useNotifications";

const ManageNotifications = () => {
	const { setNotificationToggle, notificationToggle } = useData();
	const { t } = useTranslation();
	const { theme } = useTheme();
	const {
		scheduleDailyNotification,
		scheduleCustomDailyNotification,
		cancelAllNotifications,
	} = useNotifications();

	const [selectedHour, setSelectedHour] = useState(new Date());
	const [customTitle, setCustomTitle] = useState("");
	const [customBody, setCustomBody] = useState("");
	const [isPickerVisible, setPickerVisible] = useState(false);
	const [dailyNotificationEnabled, setDailyNotificationEnabled] =
		useState(false);

	// Etat pour la customisation
	const [isCustomEditing, setIsCustomEditing] = useState(true);
	const [customNotificationScheduled, setCustomNotificationScheduled] =
		useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState("");

	// Liste de notifications aléatoires pour Melios
	const randomNotifications = [
		{
			title: "Boost de Motivation Melios",
			body: "Continue à explorer de nouvelles opportunités, tu es sur la bonne voie !",
		},
		{
			title: "Encouragement Melios",
			body: "Chaque jour est une nouvelle chance de réussir, ne lâche rien !",
		},
		{
			title: "Inspiration Melios",
			body: "Ton potentiel est infini, continue à te surpasser !",
		},
		{
			title: "Succès Melios",
			body: "Les opportunités sont à portée de main, saisis-les avec confiance !",
		},
	];

	// Animation pour le bouton
	const scaleValue = new Animated.Value(1);
	const handlePressIn = () => {
		Animated.spring(scaleValue, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	};
	const handlePressOut = () => {
		Animated.spring(scaleValue, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	};

	// Charger les préférences utilisateur
	useEffect(() => {
		const loadPreferences = async () => {
			const notificationEnabled = await AsyncStorage.getItem(
				"notificationEnabled"
			);
			const dailyNotification = await AsyncStorage.getItem(
				"dailyNotificationEnabled"
			);
			setNotificationToggle(notificationEnabled === "true");
			setDailyNotificationEnabled(dailyNotification === "true");
		};
		loadPreferences();
	}, []);

	const handleToggleNotifications = async () => {
		const newValue = !notificationToggle;
		await AsyncStorage.setItem("notificationEnabled", newValue.toString());
		setNotificationToggle(newValue);
		if (!newValue) {
			await cancelAllNotifications();
		} else {
			await scheduleDailyNotification();
		}
	};

	const handleToggleDailyNotifications = async () => {
		const newValue = !dailyNotificationEnabled;
		await AsyncStorage.setItem("dailyNotificationEnabled", newValue.toString());
		setDailyNotificationEnabled(newValue);
		if (newValue) {
			await scheduleDailyNotification();
			// On affiche la section de personnalisation par défaut
			setIsCustomEditing(true);
		} else {
			await cancelAllNotifications();
			setIsCustomEditing(false);
			setCustomNotificationScheduled(false);
			setConfirmationMessage("");
		}
	};

	const handleScheduleCustomNotification = async () => {
		const hour = selectedHour.getHours();
		const minute = selectedHour.getMinutes();
		await scheduleCustomDailyNotification(hour, minute, customTitle, customBody);
		// Confirmation et fermeture de la section de customisation
		setCustomNotificationScheduled(true);
		setIsCustomEditing(false);
		setConfirmationMessage(t("notification_scheduled_success"));
	};

	// Bouton pour définir des notifications aléatoires
	const handleSetRandomNotification = () => {
		const randomIndex = Math.floor(Math.random() * randomNotifications.length);
		const randomNotif = randomNotifications[randomIndex];
		setCustomTitle(randomNotif.title);
		setCustomBody(randomNotif.body);
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="px-5 pt-10">
				<ButtonClose />
				<Text className="text-3xl font-bold text-text mb-6">
					{t("manage_notifications")}
				</Text>

				{/* Activation des notifications */}
				<View className="flex flex-row justify-between items-center bg-card p-4 rounded-xl shadow-sm mb-4">
					<Text className="text-text text-lg">{t("set_notifications")}</Text>
					<ToggleButton
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				</View>

				{/* Activation des notifications journalières */}
				<View className="flex flex-row justify-between items-center bg-card p-4 rounded-xl shadow-sm mb-4">
					<Text className="text-text text-lg">{t("daily_reminder")}</Text>
					<ToggleButton
						onToggle={handleToggleDailyNotifications}
						value={dailyNotificationEnabled}
					/>
				</View>

				{/* Section de personnalisation affichée uniquement si le daily reminder est activé */}
				{dailyNotificationEnabled && (
					<View className="bg-card p-5 rounded-xl shadow-sm">
						{isCustomEditing ? (
							<>
								<Text className="text-xl font-semibold text-text mb-2">
									{t("custom_notification")}
								</Text>

								{/* Choix de l'heure */}
								<Pressable onPress={() => setPickerVisible(true)}>
									<View className="border border-border rounded-lg p-3 my-3">
										<Text className="text-text">
											{selectedHour.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
									</View>
								</Pressable>
								{isPickerVisible && (
									<RNDateTimePicker
										value={selectedHour}
										mode="time"
										display="default"
										onChange={(event, date) => {
											setPickerVisible(false);
											if (date) {
												setSelectedHour(date);
											}
										}}
									/>
								)}

								{/* Inputs pour le titre et le message */}
								<TextInput
									placeholder={t("custom_notification_title")}
									value={customTitle}
									onChangeText={setCustomTitle}
									placeholderTextColor={theme.colors.cardBackground}
									className="border border-border rounded-lg p-3 my-3 text-text"
								/>
								<TextInput
									placeholder={t("custom_notification_body")}
									value={customBody}
									onChangeText={setCustomBody}
									placeholderTextColor={theme.colors.cardBackground}
									className="border border-border rounded-lg p-3 my-3 text-text"
								/>

								{/* Bouton pour générer des titres et messages aléatoires */}
								<Pressable
									onPress={handleSetRandomNotification}
									className="bg-secondary p-3 rounded-xl my-3"
								>
									<Text className="text-center text-textSecondary font-semibold">
										{t("set_random_notification")}
									</Text>
								</Pressable>

								{/* Bouton pour programmer la notification */}
								<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
									<Pressable
										onPressIn={handlePressIn}
										onPressOut={handlePressOut}
										onPress={handleScheduleCustomNotification}
										className="bg-primary p-4 rounded-xl mt-3"
									>
										<Text className="text-center text-textSecondary font-semibold">
											{t("validate")}
										</Text>
									</Pressable>
								</Animated.View>
							</>
						) : (
							// Affichage de la confirmation et des infos programmées
							<View>
								{customNotificationScheduled && (
									<View className="mb-4">
										<Text className="text-lg font-semibold text-text">
											{confirmationMessage}
										</Text>
										<Text className="text-text mt-2">
											{t("notification_time")}:{" "}
											{selectedHour.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
										<Text className="text-text mt-1">
											{t("notification_message")}: {customBody}
										</Text>
									</View>
								)}
								<Pressable
									onPress={() => setIsCustomEditing(true)}
									className="bg-primary p-4 rounded-xl"
								>
									<Text className="text-center text-textSecondary font-semibold">
										{t("edit")}
									</Text>
								</Pressable>
							</View>
						)}
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
};

export default ManageNotifications;
