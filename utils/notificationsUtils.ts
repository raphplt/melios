export const getNotificationToken = async (
	AskNotification: any,
	setExpoPushToken: any,
	expoPushToken: string | undefined
) => {
	if (!expoPushToken) {
		const token: string | undefined = await AskNotification();
		setExpoPushToken(token);
	}
};
