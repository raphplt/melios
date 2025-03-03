import { useTheme } from "@context/ThemeContext";
import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import {
	daysList,
	frequencyDefaultValues,
} from "@utils/schemas/createHabit.schema";
import RowTitleCustom from "./RowTitleCustom";
import React from "react";

export default function RepeatHabit({
	register,
	setValue,
}: {
	register: any;
	setValue: any;
}) {
	const { theme } = useTheme();
	const [selectedDays, setSelectedDays]: any = useState(frequencyDefaultValues);

	useEffect(() => {
		setValue("frequency", selectedDays);
	}, [selectedDays, setValue]);

	const toggleDay = (daySlug: string) => {
		setSelectedDays((prev: any) => ({
			...prev,
			[daySlug]: !prev[daySlug],
		}));
	};

	return (
		<>
			<RowTitleCustom title="RÉPÉTITION" />

			<View
				className="rounded-lg px-4 py-4 mt-1 flex flex-row items-center justify-between h-fit w-full"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				{daysList.map((day) => (
					<Pressable
						key={day.id}
						{...register("frequency")}
						onPress={() => toggleDay(day.slug)}
						style={{
							backgroundColor: selectedDays[day.slug]
								? theme.colors.primary
								: theme.colors.border,
						}}
						className="rounded-2xl p-2 mx-1"
					>
						<Text
							style={{
								color: selectedDays[day.slug] ? theme.colors.border : theme.colors.text,
							}}
							className="text-sm"
						>
							{day.name}
						</Text>
					</Pressable>
				))}
			</View>
		</>
	);
}
