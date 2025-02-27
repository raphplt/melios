import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useData } from "../context/DataContext";
import { useEffect } from "react";
import { AppState } from "react-native";

const useNotifications = () => {
const { habits, streak, expoPushToken } = useData();

const sendPushNotification = async (
	expoPushToken: string,
	{ title, body }: { title: string; body: string }
) => {
	const message = {
		to: expoPushToken,
		sound: "default",
		title: title,
		body: body,
	};
	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(message),
	});
};

const scheduleDailyNotification = async () => {
	if (!Device.isDevice) {
		console.log("Must use physical device for notifications");
		return;
	}

	const { status } = await Notifications.getPermissionsAsync();
	if (status !== "granted") {
		const { status: newStatus } = await Notifications.requestPermissionsAsync();
		if (newStatus !== "granted") {
			console.log(
				"Permission not granted to get push token for push notification!"
			);
			return;
		}
	}

	for (const habit of habits) {
		if (habit.moment) {
			const triggerHour = parseInt(String(habit.moment));
			const triggerMinute = 0;

			if (habit.reminderMoment) {
				const reminderMinutes = habit.reminderMoment;
				const adjustedTriggerHour = Math.floor(
					(triggerHour * 60 - reminderMinutes) / 60
				);
				const adjustedTriggerMinute = (triggerHour * 60 - reminderMinutes) % 60;

				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Rappel pour ${habit.name}`,
						body: `Réalisez l'habitude ${habit.name} sur Melios !`,
						sound: true,
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DAILY,
						hour: adjustedTriggerHour,
						minute: adjustedTriggerMinute,
					},
				});
			} else {
				await Notifications.scheduleNotificationAsync({
					content: {
						title: `Rappel pour ${habit.name}`,
						body: `Réalisez l'habitude ${habit.name} sur Melios !`,
						sound: true,
					},
					trigger: {
						type: Notifications.SchedulableTriggerInputTypes.DAILY,

						hour: triggerHour,
						minute: triggerMinute,
					},
				});
			}
		}
	}

	console.log("Daily notification scheduled");
};

const scheduleInactivityNotification = async (hours: number) => {
	await Notifications.scheduleNotificationAsync({
		content: {
			title: "Vous nous manquez !",
			body: "Revenez sur Melios pour continuer vos habitudes !",
			sound: true,
		},
		trigger: {
			seconds: hours * 3600,
			type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
		},
	});
};

const cancelAllNotifications = async () => {
	await Notifications.cancelAllScheduledNotificationsAsync();
};

const sendBasicNotification = async () => {
	setTimeout(async () => {
		await Notifications.scheduleNotificationAsync({
			content: {
				title: "Basic Notification",
				body: "This is a basic notification.",
				sound: true,
			},
			trigger: null,
		});
	}, 100);
};
const sendStreakReminderNotification = async (expoPushToken: string) => {
	await sendPushNotification(expoPushToken, {
		title: "Félicitations pour votre streak !",
		body: "Continuez votre bonne habitude sur Melios !",
	});
};

useEffect(() => {
	const subscription = AppState.addEventListener("change", (nextAppState) => {
		if (nextAppState === "active") {
			cancelAllNotifications();
			scheduleInactivityNotification(48);
		}
	});

	return () => {
		subscription.remove();
	};
}, []);

useEffect(() => {
	if (streak?.value && streak.value > 3 && expoPushToken) {
		sendStreakReminderNotification(expoPushToken);
	}
}, [streak, expoPushToken]);

return {
	sendPushNotification,
	scheduleDailyNotification,
	scheduleInactivityNotification,
	cancelAllNotifications,
	sendStreakReminderNotification,
	sendBasicNotification,
};
};

export default useNotifications;