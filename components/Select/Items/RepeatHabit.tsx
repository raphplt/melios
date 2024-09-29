import { useTheme } from "@context/ThemeContext";
import { useSelect } from "@context/SelectContext";
import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import {
	daysList,
	frequencyDefaultValues,
} from "@utils/schemas/createHabit.schema";

export default function RepeatHabit({
	register,
	setValue,
	getValues,
}: {
	register: any;
	setValue: any;
	getValues: any;
}) {
	const { theme } = useTheme();
	const { habit } = useSelect();
	const [selectedDays, setSelectedDays] = useState(frequencyDefaultValues);

	useEffect(() => {
		setValue("frequency", selectedDays);
	}, [selectedDays, setValue]);

	const toggleDay = (daySlug: string) => {
		setSelectedDays((prev) => ({
			...prev,
			[daySlug]: !prev[daySlug],
		}));
	};

	return (
		<>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-lg mt-4 mb-2"
			>
				Répéter
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="rounded-xl py-3 mt-2 flex flex-row items-center justify-between px-2"
			>
				{daysList.map((day) => (
					<Pressable
						key={day.id}
						{...register("frequency")}
						onPress={() => toggleDay(day.slug)}
						style={{
							backgroundColor: selectedDays[day.slug]
								? theme.colors.primary
								: theme.colors.background,
						}}
						className="rounded-full p-2 mx-1"
					>
						<Text
							style={{
								color: selectedDays[day.slug]
									? theme.colors.background
									: theme.colors.text,
							}}
						>
							{day.name}
						</Text>
					</Pressable>
				))}
			</View>
		</>
	);
}