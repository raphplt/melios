import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Dropdown } from "react-native-element-dropdown";
import { useData } from "@context/DataContext";
import Slider from "@react-native-community/slider";
import { setMemberGoal } from "@db/goal";
import useIndex from "@hooks/useIndex";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { calcReward } from "@utils/goal";
import { useGoal } from "@context/GoalsContext";
import { useTranslation } from "react-i18next";
import ModalWrapper from "@components/Modals/ModalWrapper";
import { UserHabit } from "@type/userHabit";

export default function ModalAddGoal({
	visible,
	setVisible,
	onValidate,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onValidate?: () => void;
}) {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { habits, member } = useData();
	const { goals, setGoals } = useGoal();

	const existingHabitIds = goals.map((goal) => goal.habitId);

	const filteredHabits = habits.filter(
		(habit) => !existingHabitIds.includes(habit.id)
	);

	const habitOptions = filteredHabits.map((habit) => ({
		label: habit.name,
		value: habit.id,
	}));

	const [selectedHabit, setSelectedHabit] = useState<UserHabit>();
	const [duration, setDuration] = useState<number>(3);
	const [canValidate, setCanValidate] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const handleValidate = async () => {
		if (duration && member && member.uid) {
			const goal = {
				memberId: member.uid,
				habitId: selectedHabit?.id,
				duration,
				createdAt: new Date(),
			};
			try {
				const snapshot = await setMemberGoal(goal);

				onValidate && onValidate();
				setGoals([...goals, snapshot]);
				setVisible(false);
				setError(null);
			} catch (error) {
				setError("Erreur lors de l'ajout de l'objectif. Veuillez réessayer.");
			}
		} else {
			setError("Erreur lors de l'ajout de l'objectif. Veuillez réessayer.");
		}
	};

	useEffect(() => {
		if (selectedHabit && duration) {
			setCanValidate(true);
		} else {
			setCanValidate(false);
		}
	}, [selectedHabit, duration]);

	const block = "w-[95%] mx-auto py-2";
	const windowWidth = Dimensions.get("window").width;

	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View
				style={{
					width: windowWidth * 0.85,
				}}
			>
				<View className="flex flex-row w-full mx-auto justify-between items-center mb-2">
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-lg font-semibold text-center "
					>
						{t("create_goal")}
					</Text>
				</View>

				<View className={block}>
					<View className="flex flex-row items-center">
						<Iconify
							icon="mdi-bullseye"
							size={24}
							color={theme.dark ? "#f1f1f1" : theme.colors.primary}
						/>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold py-3 mx-2"
						>
							{t("habit")}
						</Text>
					</View>
					<Dropdown
						labelField={"label"}
						valueField={"value"}
						value={selectedHabit ? selectedHabit.id : null}
						onChange={(item) => {
							const selected = habits.find((habit) => habit.id === item.value);
							if (!selected) return;
							setSelectedHabit(selected);
							setError(null);
						}}
						data={habitOptions}
						placeholder="Choisir une habitude"
						containerStyle={{
							borderWidth: 1,
							borderColor: theme.colors.border,
							borderRadius: 10,
						}}
						placeholderStyle={{
							color: theme.colors.text,
						}}
					/>
				</View>

				<View className={block}>
					<View className="flex flex-row justify-between items-center">
						<View className="flex flex-row items-center">
							<Iconify
								icon="mdi-calendar"
								size={24}
								color={theme.dark ? "#f1f1f1" : theme.colors.primary}
							/>
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 mx-2"
							>
								{t("duration")}
							</Text>
						</View>
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[16px] font-semibold py-3"
						>
							{duration} {t("day")}
							{duration > 1 ? "s" : ""}
						</Text>
					</View>

					<Slider
						className="w-11/12 mx-auto"
						minimumValue={3}
						maximumValue={30}
						minimumTrackTintColor={theme.colors.primary}
						maximumTrackTintColor={theme.colors.textTertiary}
						value={duration}
						onValueChange={(value) => {
							setDuration(value);
							setError(null);
						}}
						step={1}
						thumbTintColor={theme.colors.primary}
						aria-label="Slider days"
					/>
				</View>

				{selectedHabit && (
					<View className={block}>
						<View className="flex flex-row justify-between items-center">
							<View className="flex flex-row items-center">
								<Iconify
									icon="mdi-currency-usd"
									size={24}
									color={theme.dark ? "#f1f1f1" : theme.colors.primary}
								/>
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[16px] font-semibold py-3 "
								>
									{t("reward")}
								</Text>
							</View>
							<View className="flex flex-row items-center">
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="mx-1 font-semibold text-[16px]"
								>
									{duration - 2 || 0}
								</Text>
								<MoneyMelios />
							</View>
						</View>
					</View>
				)}

				{error && (
					<View className="w-11/12 mx-auto py-2">
						<Text
							style={{
								color: theme.colors.redPrimary,
							}}
							className="text-[14px] font-semibold py-3 mx-2"
						>
							{error}
						</Text>
					</View>
				)}

				<Pressable onPress={handleValidate} disabled={!canValidate}>
					<View
						style={{
							backgroundColor: canValidate
								? theme.colors.primary
								: theme.colors.grayPrimary,
						}}
						className="w-11/12 mx-auto rounded-xl py-2 my-3 flex flex-row items-center justify-center"
					>
						<Iconify icon="mdi-check" size={24} color="#f1f1f1" />
					</View>
				</Pressable>
			</View>
		</ModalWrapper>
	);
}
