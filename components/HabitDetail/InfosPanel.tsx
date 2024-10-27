import { Text, View, StyleSheet } from "react-native";
import { Iconify } from "react-native-iconify";

import { UserHabit } from "@type/userHabit";
import { useTheme } from "@context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

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
		<BlurView
			intensity={70}
			className="w-11/12 mx-auto p-4 rounded-xl my-4"
			style={{
				overflow: "hidden",
			}}
		>
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-[16px] text-pretty ml-4 py-2 w-11/12 mx-auto font-semibold"
			>
				{habit.description}
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
					{Object.entries(habit.frequency as any).map(([day, isActive]) => (
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
		</BlurView>
	);
}

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});
