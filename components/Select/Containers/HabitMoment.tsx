import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function HabitMoment({
	setValue,
	register,
}: {
	setValue: any;
	register: any;
}) {
	const { theme } = useTheme();
	const { habit } = useSelect();

	const blockStyle =
		"flex flex-row items-center justify-evenly flex-1 p-2 rounded-xl w-2/3 mx-2";

	const [selectedMoment, setSelectedMoment] = useState(habit?.moment || 0);

	useEffect(() => {
		setValue("moment", selectedMoment);
	}, [selectedMoment, setValue]);

	const handleSelectMoment = (moment: number) => {
		setSelectedMoment(moment);
	};

	return (
		<>
			<Text
				style={{
					color: theme.colors.textTertiary,
				}}
				className="text-lg mt-2 mb-2"
			>
				Heure
			</Text>

			{/* Elements du haut */}
			<View className="flex flex-row items-center justify-between pb-2">
				<View
					className={blockStyle}
					style={{
						backgroundColor: theme.colors.background,
						width: 1,
					}}
				>
					<Text className="py-2 text-[15px]">Personnaliser</Text>
					<Iconify
						icon="fluent:chevron-right-24-filled"
						size={20}
						color={theme.colors.text}
					/>
				</View>
				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment === -1 ? theme.colors.primary : theme.colors.background,
						width: 1,
					}}
					onPress={() => handleSelectMoment(-1)}
					{...register("moment")}
				>
					<Text
						className="py-2 text-[15px]"
						style={{
							color:
								selectedMoment === -1 ? theme.colors.background : theme.colors.text,
						}}
					>
						Heure libre
					</Text>
					<Iconify
						icon="tabler:time-duration-off"
						size={20}
						color={
							selectedMoment === -1 ? theme.colors.background : theme.colors.text
						}
					/>
				</Pressable>
			</View>

			{/* Elements du bas */}
			<View className="flex flex-row items-center justify-between py-2">
				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment >= 6 && selectedMoment < 12
								? theme.colors.primary
								: theme.colors.background,
						width: 1,
					}}
					onPress={() => handleSelectMoment(7)}
					{...register("moment")}
				>
					<Text
						className="py-2 text-[15px]"
						style={{
							color:
								selectedMoment >= 6 && selectedMoment < 12
									? theme.colors.background
									: theme.colors.text,
						}}
					>
						Matin
					</Text>
					<Iconify
						icon="ph:sun-horizon"
						size={20}
						color={
							selectedMoment >= 6 && selectedMoment < 12
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>

				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment >= 12 && selectedMoment < 18
								? theme.colors.primary
								: theme.colors.background,
						width: 1,
					}}
					onPress={() => handleSelectMoment(12)}
					{...register("moment")}
				>
					<Text
						className="py-2 text-[15px]"
						style={{
							color:
								selectedMoment >= 12 && selectedMoment < 18
									? theme.colors.background
									: theme.colors.text,
						}}
					>
						Midi
					</Text>
					<Iconify
						icon="ph:sun"
						size={20}
						color={
							selectedMoment >= 12 && selectedMoment < 18
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>

				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment >= 18 && selectedMoment < 24
								? theme.colors.primary
								: theme.colors.background,
						width: 1,
					}}
					onPress={() => handleSelectMoment(18)}
					{...register("moment")}
				>
					<Text
						className="py-2 text-[15px]"
						style={{
							color:
								selectedMoment >= 18 && selectedMoment < 24
									? theme.colors.background
									: theme.colors.text,
						}}
					>
						Soir
					</Text>
					<Iconify
						icon="ph:moon"
						size={20}
						color={
							selectedMoment >= 18 && selectedMoment < 24
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>
			</View>
		</>
	);
}
