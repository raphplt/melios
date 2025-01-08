import { Text, View, StyleSheet } from "react-native";
import { Iconify } from "react-native-iconify";

import { UserHabit } from "@type/userHabit";
import { useTheme } from "@context/ThemeContext";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { useHabits } from "@context/HabitsContext";

export default function InfosPanel() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { currentHabit } = useHabits();

	if (!currentHabit) return null;

	const rowStyle =
		"flex flex-row justify-between items-center w-full mx-auto px-4";

	const rowBox = "flex flex-row items-center gap-2";

	const dark = theme.dark;
	const textColor = dark ? theme.colors.textSecondary : theme.colors.text;

	const Separator = () => (
		<View
			style={{
				borderBottomColor: currentHabit.color || theme.colors.border,
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
			tint="light"
		>
			<Text
				style={{
					color: textColor,
				}}
				className="text-[16px] text-pretty ml-4 py-2 w-11/12 mx-auto font-semibold"
			>
				{currentHabit.description}
			</Text>

			<Separator />

			{/* Durée */}
			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={textColor} icon="material-symbols:timer" />
					<Text style={{ color: textColor }} className="font-semibold">
						{t("duration")}
					</Text>
				</View>
				<Text style={{ color: textColor }}>
					{currentHabit.duration ?? 0} {t("minutes")}
				</Text>
			</View>

			<Separator />

			{/* Catégorie */}

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify size={24} color={textColor} icon="material-symbols:category" />
					<Text style={{ color: textColor }} className="font-semibold">
						{t("category")}
					</Text>
				</View>
				<Text style={{ color: textColor }}>{currentHabit.category}</Text>
			</View>

			<Separator />

			{/* Moment */}

			<View className={rowStyle}>
				<View className={rowBox}>
					<Iconify
						size={24}
						color={textColor}
						icon="material-symbols:view-agenda-outline"
					/>
					<Text style={{ color: textColor }} className="font-semibold">
						{t("moment")}
					</Text>
				</View>

				<Text style={{ color: textColor }}>
					à {currentHabit.moment !== -1 ? currentHabit.moment : currentHabit.moment}{" "}
					heure
				</Text>
			</View>

			<Separator />

			{/* Fréquence */}

			<View className="px-4 mx-auto">
				<View className={rowBox}>
					<Iconify size={24} color={textColor} icon="material-symbols:repeat" />

					<Text
						style={{ color: textColor }}
						className="font-semibold flex w-11/12 mx-auto"
					>
						{t("frequency")}
					</Text>
				</View>
				<View className="flex flex-row items-center justify-center w-full mt-2">
					{Object.entries(currentHabit.frequency as any).map(([day, isActive]) => (
						<View
							key={day}
							style={{
								backgroundColor: isActive
									? currentHabit.color || theme.colors.primary
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
