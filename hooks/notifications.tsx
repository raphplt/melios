const notifications = () => {
	const sendPushNotification = async (
		expoPushToken: string,
		{ title, body }: { title: string; body: string }
	) => {
		const message = {
			to: expoPushToken,
			sound: "default",
			title: title,
			body: body,
			data: { someData: "goes here" },
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

	return { sendPushNotification };
};

export default notifications;
