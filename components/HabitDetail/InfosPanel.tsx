import { Text, View } from "react-native";
import { Iconify } from "react-native-iconify";

import { UserHabit } from "@type/userHabit";
import { useTheme } from "@context/ThemeContext";

export default function InfosPanel({
	habit,
	lightenedColor,
}: {
	habit: UserHabit;
	lightenedColor: string;
}) {
	const { theme } = useTheme();

	const rowStyle =
		"flex flex-row justify-between items-center w-full mx-auto px-4";

	const rowBox = "flex flex-row items-center gap-2";

	const Separator = () => (
		<View
			style={{
				borderBottomColor: habit.color || theme.colors.border,
				width: "100%",
				height: 1,
				borderBottomWidth: 1,
				marginTop: 10,
				marginBottom: 10,
			}}
		/>
	);

	return (
		<View
			className="flex flex-col items-center justify-between w-11/12 mx-auto py-4 rounded-lg mt-6"
			style={{
				backgroundColor: lightenedColor || theme.colors.cardBackground,
				borderColor: habit.color || theme.colors.border,
				borderWidth: 2,
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-[16px] text-pretty ml-4 pb-2 w-11/12 mx-auto font-semibold"
			>
				"{habit.description}"
			</Text>

			<Separator />

			{/* Durée */}
			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify
						size={24}
						color={theme.colors.text}
						icon="material-symbols:timer"
					/>
					<Text style={{ color: theme.colors.text }} className="font-semibold">
						Durée
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{habit.duration} minutes</Text>
			</View>

			<Separator />

			{/* Catégorie */}

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify
						size={24}
						color={theme.colors.text}
						icon="material-symbols:category"
					/>
					<Text style={{ color: theme.colors.text }} className="font-semibold">
						Catégorie
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{habit.category}</Text>
			</View>

			<Separator />

			{/* Moment */}

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify
						size={24}
						color={theme.colors.text}
						icon="material-symbols:view-agenda-outline"
					/>
					<Text style={{ color: theme.colors.text }} className="font-semibold">
						Moment
					</Text>
				</View>

				<Text style={{ color: theme.colors.text }}>à {habit.moment} heure</Text>
			</View>

			<Separator />

			{/* Fréquence */}

			<View className="px-4 mx-auto">
				<View className={rowBox}>
					<Iconify
						size={24}
						color={theme.colors.text}
						icon="material-symbols:repeat"
					/>

					<Text
						style={{ color: theme.colors.text }}
						className="font-semibold flex w-11/12 mx-auto"
					>
						Fréquence
					</Text>
				</View>
				<View className="flex flex-row items-center justify-center w-full mt-2">
					{Object.entries(habit.frequency).map(([day, isActive]) => (
						<View
							key={day}
							style={{
								backgroundColor: isActive
									? habit.color || theme.colors.primary
									: theme.colors.background,
							}}
							className="rounded-full p-2 mx-1 w-11"
						>
							<Text
								style={{
									color: isActive ? theme.colors.textSecondary : theme.colors.primary,
								}}
								className="text-center"
							>
								{day.charAt(0).toUpperCase() + day.slice(1, 2)}
							</Text>
						</View>
					))}
				</View>
			</View>

			{/* <View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="mdi:fire" />
					<Text style={{ color: theme.colors.text }} className="font-semibold">
						Difficulté
					</Text>
				</View>
				<Text style={{ color: theme.colors.text }}>{difficulty ?? ""}</Text>
			</View> */}
			{/* <View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={theme.colors.text} icon="ph:coin" />
					<Text style={{ color: theme.colors.text }} className="font-semibold">
						Points
					</Text>
				</View>
				<View className="flex flex-row gap-3">
					<View className="flex flex-row items-center">
						<MoneyOdyssee />
						<Text style={{ color: theme.colors.text }} className="ml-1">
							{Math.round(habit.reward * (habit.difficulty / 2))}
						</Text>
					</View>
					<View className="flex flex-row items-center gap4">
						<MoneyMelios />
						<Text style={{ color: theme.colors.text }} className="ml-1">
							{habit.difficulty}
						</Text>
					</View>
				</View>
			</View> */}
		</View>
	);
}
