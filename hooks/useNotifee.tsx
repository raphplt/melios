import { useEffect } from "react";
import notifee from "@notifee/react-native";

export const useNotificationConfig = () => {
	useEffect(() => {
		async function createChannel() {
			await notifee.createChannel({
				id: "foreground_service",
				name: "Foreground Service",
				importance: 2,
			});
		}
		createChannel();
	}, []);
};
