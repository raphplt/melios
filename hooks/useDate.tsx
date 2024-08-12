const useDate = () => {
	const currentHour = new Date().getHours();

	const isDayTime = currentHour >= 6 && currentHour < 20;

	return {
		currentHour,
		isDayTime,
	};
};

export default useDate;
