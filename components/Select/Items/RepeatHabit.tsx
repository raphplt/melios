import { useTheme } from "@context/ThemeContext";
import { Text, View, Pressable } from "react-native";
import { useState, useEffect } from "react";
import {
	daysList,
	frequencyDefaultValues,
} from "@utils/schemas/createHabit.schema";
import { BlurView } from "expo-blur";
import RowTitleCustom from "./RowTitleCustom";
import React from "react";

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

			<BlurView
				intensity={90}
				className="rounded-xl px-4 py-4 mt-1 flex flex-row items-center justify-between h-fit"
				style={{
					overflow: "hidden",
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
			</BlurView>
		</>
	);
}
