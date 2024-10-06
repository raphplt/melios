import { useSelect } from "@context/SelectContext";
import { useTheme } from "@context/ThemeContext";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
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
		"flex flex-row items-center justify-evenly flex-1 p-2 rounded-3xl px-2 mx-1";

	const [selectedMoment, setSelectedMoment] = useState(habit?.moment || 0);
	const [visible, setVisible] = useState(false);
	const [customMoment, setCustomMoment] = useState<Date | null>(null);

	useEffect(() => {
		setValue("moment", selectedMoment);
	}, [selectedMoment, setValue]);

	const resetCustomMoment = () => {
		setCustomMoment(null);
	};

	const handleSelectMoment = (moment: number) => {
		resetCustomMoment();
		setSelectedMoment(moment);
	};

	const handleCustomMoment = (date: Date) => {
		setCustomMoment(date);
		setSelectedMoment(-2);
		setVisible(false);
	};

	return (
		<>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-[16px] mt-4 mb-2"
			>
				HEURE
			</Text>

			{/* Elements du haut */}
			<View className="flex flex-row items-center justify-between pb-2">
				<Pressable
					className={blockStyle}
					style={{
						backgroundColor: customMoment
							? theme.colors.primary
							: theme.colors.background,
						width: 1,
					}}
					onPress={() => setVisible(true)}
				>
					<Text
						className="py-2 text-[15px] mx-auto"
						style={{
							color:
								selectedMoment === -2 ? theme.colors.background : theme.colors.text,
						}}
					>
						{(customMoment && moment(customMoment).format("HH:mm")) ||
							"Personnalisée"}
					</Text>
					<Iconify
						icon="fluent:chevron-right-24-filled"
						size={20}
						color={
							selectedMoment === -2 ? theme.colors.background : theme.colors.text
						}
					/>
				</Pressable>
				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment === -1 && !customMoment
								? theme.colors.primary
								: theme.colors.background,
						width: 1,
					}}
					onPress={() => handleSelectMoment(-1)}
					{...register("moment")}
				>
					<Text
						className="py-2 text-[15px]"
						style={{
							color:
								selectedMoment === -1 && !customMoment
									? theme.colors.background
									: theme.colors.text,
						}}
					>
						Heure libre
					</Text>
					<Iconify
						icon="tabler:time-duration-off"
						size={20}
						color={
							selectedMoment === -1 && !customMoment
								? theme.colors.background
								: theme.colors.text
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
							selectedMoment >= 6 && selectedMoment < 12 && !customMoment
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
								selectedMoment >= 6 && selectedMoment < 12 && !customMoment
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
							selectedMoment >= 6 && selectedMoment < 12 && !customMoment
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>

				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment >= 12 && selectedMoment < 18 && !customMoment
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
								selectedMoment >= 12 && selectedMoment < 18 && !customMoment
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
							selectedMoment >= 12 && selectedMoment < 18 && !customMoment
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>

				<Pressable
					className={blockStyle}
					style={{
						backgroundColor:
							selectedMoment >= 18 && selectedMoment < 24 && !customMoment
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
								selectedMoment >= 18 && selectedMoment < 24 && !customMoment
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
							selectedMoment >= 18 && selectedMoment < 24 && !customMoment
								? theme.colors.background
								: theme.colors.text
						}
					/>
				</Pressable>
			</View>

			{/* Affichage du sélecteur de date pour l'heure personnalisée */}
			{visible && (
				<RNDateTimePicker
					mode="time"
					value={customMoment || new Date()}
					onChange={(e, date) => {
						if (date) {
							setVisible(false);
							handleCustomMoment(date);
						} else {
							setVisible(false);
						}
					}}
				/>
			)}
		</>
	);
}