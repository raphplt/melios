import { useTheme } from "@context/ThemeContext";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Dropdown } from "react-native-element-dropdown";
import { useData } from "@context/DataContext";
import Slider from "@react-native-community/slider";
import { setMemberGoal } from "@db/goal";
import MoneyMelios from "@components/Svg/MoneyMelios";
import { useGoal } from "@context/GoalsContext";
import { useTranslation } from "react-i18next";
import { UserHabit } from "@type/userHabit";
import BottomSlideModal from "@components/Modals/ModalBottom";
import { FontAwesome6 } from "@expo/vector-icons";
import { HabitType } from "@utils/category.type";

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
		(habit) =>
			!existingHabitIds.includes(habit.id) && habit.type !== HabitType.negative
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

	const block = "w-full mx-auto py-2";
	const windowWidth = Dimensions.get("window").width;

	return (
		<BottomSlideModal visible={visible} setVisible={setVisible}>
			<View className="flex flex-col items-center gap-y-2">
				<View className="flex flex-row justify-start items-center mb-2 w-full gap-2">
					<Iconify
						icon="mingcute:target-line"
						size={24}
						color={theme.colors.primary}
					/>
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-xl font-semibold text-center "
					>
						{t("create_goal")}
					</Text>
				</View>

				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-sm font-normal"
				>
					{t("create_goal_description")}
				</Text>

				<View className={block}>
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-[16px] font-semibold py-3 mx-2"
					>
						1. {t("choose_habit")}
					</Text>
					<Dropdown
						labelField={"label"}
						valueField={"value"}
						placeholder={t("my_habits")}
						value={selectedHabit ? selectedHabit.id : null}
						onChange={(item) => {
							const selected = habits.find((habit) => habit.id === item.value);
							if (!selected) return;
							setSelectedHabit(selected);
							setError(null);
						}}
						renderItem={(item) => (
							<View className="flex flex-row items-center py-2 px-2">
								<View className="flex items-center justify-center w-6 h-6 rounded-full">
									<FontAwesome6
										name={
											habits.find((habit) => habit.id === item.value)?.icon || "question"
										}
										size={14}
										color={
											habits.find((habit) => habit.id === item.value)?.color ||
											theme.colors.primary
										}
									/>
								</View>
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[16px] ml-2"
								>
									{item.label}
								</Text>

								{selectedHabit?.id === item.value && (
									<Iconify
										icon="mdi-check"
										size={20}
										color={theme.colors.primary}
										style={{ marginLeft: "auto" }}
									/>
								)}
							</View>
						)}
						style={{
							borderColor: theme.colors.grayPrimary,
							borderWidth: 1,
							paddingHorizontal: 10,
							paddingVertical: 10,
							borderRadius: 10,
							width: "100%",
						}}
						data={habitOptions}
						backgroundColor="rgba(0, 0, 0, 0.4)"
						containerStyle={{
							borderWidth: 1,
							borderColor: theme.colors.border,
							borderRadius: 10,
							paddingVertical: 10,
							paddingHorizontal: 5,
						}}
						mode="modal"
						placeholderStyle={{
							color: theme.colors.textTertiary,
							fontSize: 14,
						}}
					/>
				</View>

				<View className={block}>
					<View className="flex flex-row justify-between items-center">
						<View className="flex flex-row items-center">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 mx-2"
							>
								2. {t("choose_duration")}
							</Text>
						</View>
						{selectedHabit && (
							<View
								style={{
									backgroundColor: theme.colors.backgroundTertiary,
								}}
								className="py-2 px-4 rounded-2xl w-24 flex flex-row items-center justify-center"
							>
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[15px]"
								>
									{duration} {t("day")}
									{duration > 1 ? "s" : ""}
								</Text>
							</View>
						)}
					</View>

					<Slider
						className="w-11/12 mx-auto"
						minimumValue={3}
						maximumValue={30}
						minimumTrackTintColor={theme.colors.primary}
						maximumTrackTintColor={theme.colors.grayPrimary}
						value={duration}
						onValueChange={(value) => {
							setDuration(Math.floor(value));
							setError(null);
						}}
						step={1}
						thumbTintColor={theme.colors.primary}
						aria-label="Slider days"
						disabled={!selectedHabit}
					/>
				</View>

				<View className={block}>
					<View className="flex flex-row justify-between items-center">
						<View className="flex flex-row items-center">
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 "
							>
								3. {t("reward")}
							</Text>
						</View>
						{selectedHabit && (
							<View
								style={{
									borderColor: theme.colors.primary,
									borderWidth: 1,
								}}
								className="py-[2px] px-4 rounded-2xl w-24 flex flex-row items-center justify-center gap-2"
							>
								<Text
									style={{
										color: theme.colors.primary,
									}}
									className="text-[15px] font-semibold"
								>
									{duration - 2 || 0}
								</Text>
								<MoneyMelios width={20} />
							</View>
						)}
					</View>
				</View>
				{selectedHabit && (
					<View
						style={{
							backgroundColor: theme.colors.cardBackground,
							borderColor: theme.colors.border,
							borderWidth: 1,
						}}
						className="w-full gap-2 mx-auto py-2 px-4 rounded-2xl flex flex-row items-center justify-start"
					>
						<Iconify icon="mdi-information" size={24} color={theme.colors.primary} />
						<Text
							style={{
								color: theme.colors.textTertiary,
							}}
							className="text-sm font-normal"
						>
							{t("reward_description")}
						</Text>
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

				<Pressable
					onPress={handleValidate}
					disabled={!canValidate}
					style={{
						backgroundColor: canValidate
							? theme.colors.primary
							: theme.colors.grayPrimary,
					}}
					className="rounded-2xl py-3 my-3 w-full flex flex-row items-center justify-center"
				>
					<Text
						style={{
							color: canValidate ? "#fff" : "#fff",
						}}
						className="text-[16px] font-semibold mx-2"
					>
						{t("create")}
					</Text>
					<Iconify icon="mdi-plus" size={24} color="#f1f1f1" />
				</Pressable>
			</View>
		</BottomSlideModal>
	);
}
