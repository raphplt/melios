import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { Iconify } from "react-native-iconify";
import ZoomableView from "@components/Shared/ZoomableView";

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
	const [isCustomEditing, setIsCustomEditing] = useState(true);
	const [customNotificationScheduled, setCustomNotificationScheduled] =
		useState(false);
	const [confirmationMessage, setConfirmationMessage] = useState("");

	// Animation du bouton avec useRef pour éviter la recréation
	const scaleValue = useRef(new Animated.Value(1)).current;

	// Chargement groupé des préférences utilisateur
	useEffect(() => {
		const loadPreferences = async () => {
			try {
				const keys = [
					"notificationEnabled",
					"dailyNotificationEnabled",
					"customNotificationHour",
					"customNotificationMinute",
					"customNotificationTitle",
					"customNotificationBody",
				];
				const stores = await AsyncStorage.multiGet(keys);
				const prefs = Object.fromEntries(stores);

				setNotificationToggle(prefs.notificationEnabled === "true");
				setDailyNotificationEnabled(prefs.dailyNotificationEnabled === "true");

				if (prefs.customNotificationHour && prefs.customNotificationMinute) {
					const date = new Date();
					date.setHours(parseInt(prefs.customNotificationHour, 10));
					date.setMinutes(parseInt(prefs.customNotificationMinute, 10));
					setSelectedHour(date);
				}
				if (prefs.customNotificationTitle)
					setCustomTitle(prefs.customNotificationTitle);
				if (prefs.customNotificationBody)
					setCustomBody(prefs.customNotificationBody);
			} catch (error) {
				console.error("Erreur lors du chargement des préférences :", error);
			}
		};
		loadPreferences();
	}, [setNotificationToggle]);

	// Gestion de l'animation du bouton
	const handlePressIn = useCallback(() => {
		Animated.spring(scaleValue, {
			toValue: 0.95,
			useNativeDriver: true,
		}).start();
	}, [scaleValue]);

	const handlePressOut = useCallback(() => {
		Animated.spring(scaleValue, {
			toValue: 1,
			useNativeDriver: true,
		}).start();
	}, [scaleValue]);

	// Activation/Désactivation globale des notifications
	const handleToggleNotifications = useCallback(async () => {
		const newValue = !notificationToggle;
		try {
			await AsyncStorage.setItem("notificationEnabled", newValue.toString());
			setNotificationToggle(newValue);
			if (!newValue) {
				await cancelAllNotifications();
			} else {
				await scheduleDailyNotification();
			}
		} catch (error) {
			console.error(error);
		}
	}, [
		notificationToggle,
		cancelAllNotifications,
		scheduleDailyNotification,
		setNotificationToggle,
	]);

	// Activation/Désactivation des notifications journalières
	const handleToggleDailyNotifications = useCallback(async () => {
		const newValue = !dailyNotificationEnabled;
		try {
			await AsyncStorage.setItem("dailyNotificationEnabled", newValue.toString());
			setDailyNotificationEnabled(newValue);
			if (newValue) {
				await scheduleDailyNotification();
				setIsCustomEditing(true);
			} else {
				await cancelAllNotifications();
				setIsCustomEditing(false);
				setCustomNotificationScheduled(false);
				setConfirmationMessage("");
			}
		} catch (error) {
			console.error(error);
		}
	}, [
		dailyNotificationEnabled,
		cancelAllNotifications,
		scheduleDailyNotification,
	]);

	// Planification d'une notification personnalisée
	const handleScheduleCustomNotification = useCallback(async () => {
		try {
			const hour = selectedHour.getHours();
			const minute = selectedHour.getMinutes();
			await AsyncStorage.multiSet([
				["customNotificationHour", hour.toString()],
				["customNotificationMinute", minute.toString()],
				["customNotificationTitle", customTitle],
				["customNotificationBody", customBody],
			]);
			await scheduleCustomDailyNotification(hour, minute, customTitle, customBody);
			setCustomNotificationScheduled(true);
			setIsCustomEditing(false);
			setConfirmationMessage(t("notification_scheduled_success"));
		} catch (error) {
			console.error(error);
		}
	}, [
		selectedHour,
		customTitle,
		customBody,
		scheduleCustomDailyNotification,
		t,
	]);

	// Génération d'une notification aléatoire
	const handleSetRandomNotification = useCallback(() => {
		const randomNotifications = [
			{
				title: "Boost de Motivation Melios",
				body:
					"Continue à explorer de nouvelles opportunités, tu es sur la bonne voie !",
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
		const randomIndex = Math.floor(Math.random() * randomNotifications.length);
		const randomNotif = randomNotifications[randomIndex];
		setCustomTitle(randomNotif.title);
		setCustomBody(randomNotif.body);
	}, []);

	return (
		<SafeAreaView className="flex-1 bg-background">
			<ScrollView className="px-5 pt-10">
				<ButtonClose />
				<Text className="text-3xl font-bold mb-6">{t("manage_notifications")}</Text>

				{/* Activation globale des notifications */}
				<View
					className="flex flex-row justify-between items-center p-4 rounded-xl shadow-sm mb-4"
					style={{ backgroundColor: theme.colors.cardBackground }}
				>
					<Text className="text-lg">{t("set_notifications")}</Text>
					<ToggleButton
						onToggle={handleToggleNotifications}
						value={notificationToggle}
					/>
				</View>

				{/* Activation des notifications journalières */}
				<View
					className="flex flex-row justify-between items-center p-4 rounded-xl shadow-sm mb-4"
					style={{ backgroundColor: theme.colors.cardBackground }}
				>
					<Text className="text-lg">{t("daily_reminder")}</Text>
					<ToggleButton
						onToggle={handleToggleDailyNotifications}
						value={dailyNotificationEnabled}
					/>
				</View>

				{/* Section de personnalisation si activé */}
				{dailyNotificationEnabled && (
					<View
						className="px-5 py-4 rounded-xl shadow-sm"
						style={{ backgroundColor: theme.colors.cardBackground }}
					>
						{isCustomEditing ? (
							<>
								<View className="flex flex-row justify-between items-center  mb-2">
									<Text className="text-xl font-semibold">
										{t("custom_notification")}
									</Text>

									<ZoomableView>
										<Pressable
											onPress={handleSetRandomNotification}
											className="p-3 rounded-xl"
											style={{ elevation: 1, backgroundColor: theme.colors.primary }}
										>
											<Iconify
												icon="mdi:shuffle"
												size={20}
												color={theme.colors.textSecondary}
											/>
										</Pressable>
									</ZoomableView>
								</View>

								{/* Sélection de l'heure */}
								<Pressable onPress={() => setPickerVisible(true)}>
									<View
										className=" rounded-lg p-3 py-4 my-2"
										style={{
											backgroundColor: theme.colors.background,
											elevation: 1,
										}}
									>
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
											if (date) setSelectedHour(date);
										}}
									/>
								)}

								{/* Saisie du titre et du message */}
								<TextInput
									placeholder={t("custom_notification_title")}
									value={customTitle}
									onChangeText={setCustomTitle}
									placeholderTextColor={theme.colors.textTertiary}
									style={{
										color: theme.colors.text,
										backgroundColor: theme.colors.background,
										elevation: 5,
									}}
									className="rounded-lg p-3 my-2 text-text"
								/>
								<TextInput
									placeholder={t("custom_notification_body")}
									value={customBody}
									onChangeText={setCustomBody}
									placeholderTextColor={theme.colors.textTertiary}
									style={{
										color: theme.colors.text,
										backgroundColor: theme.colors.background,
										elevation: 5,
									}}
									className=" rounded-lg p-3 my-2 text-text"
								/>

								{/* Validation de la notification personnalisée */}
								<Animated.View style={{ transform: [{ scale: scaleValue }] }}>
									<Pressable
										onPressIn={handlePressIn}
										onPressOut={handlePressOut}
										onPress={handleScheduleCustomNotification}
										className=" p-4 rounded-xl w-full flex items-center justify-center mx-auto mt-4"
										style={{ backgroundColor: theme.colors.primary }}
									>
										<Text
											className="text-center text-textSecondary font-semibold"
											style={{
												color: theme.colors.textSecondary,
											}}
										>
											{t("validate")}
										</Text>
									</Pressable>
								</Animated.View>
							</>
						) : (
							// Confirmation et possibilité d'édition
							<View>
								{customNotificationScheduled && (
									<View className="mb-4">
										<Text className="text-lg font-semibold text-text mb-2">
											{confirmationMessage}
										</Text>
										<Text
											className="py-2"
											style={{
												color: theme.colors.text,
											}}
										>
											{t("notification_time")}:{" "}
											{selectedHour.toLocaleTimeString([], {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</Text>
										<Text
											className="py-2"
											style={{
												color: theme.colors.text,
											}}
										>
											{t("notification_message")}: {customBody}
										</Text>
									</View>
								)}
								<Pressable
									onPress={() => setIsCustomEditing(true)}
									className=" p-4 rounded-xl w-full flex items-center justify-center mx-auto"
									style={{ backgroundColor: theme.colors.primary }}
								>
									<Text
										className="text-center text-textSecondary font-semibold"
										style={{
											color: theme.colors.textSecondary,
										}}
									>
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
