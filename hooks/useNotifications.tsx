import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useData } from "../context/DataContext";

const useNotifications = () => {
	const { habits } = useData();

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
							hour: adjustedTriggerHour,
							minute: adjustedTriggerMinute,
							repeats: true,
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
							hour: triggerHour,
							minute: triggerMinute,
							repeats: true,
						},
					});
				}
			}
		}

		console.log("Daily notification scheduled");
	};

	const cancelAllNotifications = async () => {
		await Notifications.cancelAllScheduledNotificationsAsync();
	};

	return {
		sendPushNotification,
		scheduleDailyNotification,
		cancelAllNotifications,
	};
};

export default useNotifications;