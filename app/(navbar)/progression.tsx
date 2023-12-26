import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import moment from "moment";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
	const [habits, setHabits] = useState([]);

	useEffect(() => {
		const interval = setInterval(() => {
			setDate(moment().format("YYYY-MM-DD"));
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				className="text-center mb-4 text-xl mt-3"
				style={{ color: theme.colors.text }}
			>
				Progression
			</Text>
			<View />
			{/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
		</View>
	);
}
