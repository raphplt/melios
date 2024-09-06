import { DarkTheme } from "@constants/Theme";
import { useState } from "react";
import { Calendar, LocaleConfig } from "react-native-calendars";

const CalendarHabits = () => {
	const [selected, setSelected] = useState("");

	return (
		<Calendar
			markingType={"period"}
			markedDates={{
				"2024-09-11": { startingDay: true, color: "green", textColor: "white" },
				"2024-09-12": {
					selected: true,
					endingDay: true,
					color: "green",
					textColor: "white",
				},
				"2012-05-04": {
					disabled: true,
					startingDay: true,
					color: "green",
					endingDay: true,
				},
			}}
		/>
	);
};

export default CalendarHabits;
