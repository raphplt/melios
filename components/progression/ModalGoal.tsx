import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Iconify } from "react-native-iconify";
import { Dropdown } from "react-native-element-dropdown";
import { useData } from "@context/DataContext";
import Slider from "@react-native-community/slider";
import { setMemberGoal } from "@db/goal";

export default function ModalGoal({
	visible,
	setVisible,
	onValidate,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onValidate?: () => void;
}) {
	const { theme } = useContext(ThemeContext);
	const { habits, member } = useData();

	const habitOptions = habits.map((habit) => ({
		label: habit.name,
		value: habit.id,
	}));

	const [selectedHabit, setSelectedHabit] = useState<any>();
	const [duration, setDuration] = useState<number>(1);
	const [canValidate, setCanValidate] = useState<boolean>(false);

	const handleValidate = async () => {
		if (selectedHabit && duration && member && member.uid) {
			const goal = {
				memberId: member.uid,
				habitId: selectedHabit.value,
				duration,
				createdAt: new Date(),
			};
			try {
				await setMemberGoal(goal);
				onValidate && onValidate();
				setVisible(false);
			} catch (error) {
				console.error("Erreur lors de l'ajout de l'objectif: ", error);
			}
		}
	};

	useEffect(() => {
		if (selectedHabit && duration) {
			setCanValidate(true);
		} else {
			setCanValidate(false);
		}
	}, [selectedHabit, duration]);

	const block = "w-11/12 mx-auto py-2";

	return (
		<Modal
			visible={visible}
			transparent={true}
			hardwareAccelerated={true}
			onRequestClose={() => {
				setVisible(false);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					backgroundColor: "rgba(0,0,0,0.4)",
				}}
			>
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
					className="w-[95%] mx-auto rounded-xl "
				>
					<View className="flex flex-row w-full mx-auto justify-between items-center px-5 py-3">
						<Text
							style={{
								color: theme.colors.text,
								fontFamily: "BaskervilleBold",
							}}
							className="text-lg font-semibold text-center "
						>
							Créer un objectif
						</Text>
						<Pressable
							onPress={() => {
								setVisible(false);
							}}
							className=""
						>
							<Iconify icon="mdi-close" size={28} color={theme.colors.textTertiary} />
						</Pressable>
					</View>

					<View className={block}>
						<View className="flex flex-row items-center">
							<Iconify icon="mdi-bullseye" size={24} color={theme.colors.primary} />
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3 mx-2"
							>
								Habitude
							</Text>
						</View>
						<Dropdown
							labelField={"label"}
							valueField={"value"}
							value={selectedHabit}
							onChange={(item) => setSelectedHabit(item)}
							data={habitOptions}
							placeholder="Choisir une habitude"
							style={{
								backgroundColor: theme.colors.backgroundSecondary,
								padding: 10,
								borderRadius: 10,
							}}
						/>
					</View>

					<View className={block}>
						<View className="flex flex-row justify-between items-center">
							<View className="flex flex-row items-center">
								<Iconify icon="mdi-calendar" size={24} color={theme.colors.primary} />
								<Text
									style={{
										color: theme.colors.text,
									}}
									className="text-[16px] font-semibold py-3 mx-2"
								>
									Durée
								</Text>
							</View>
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="text-[16px] font-semibold py-3"
							>
								{duration} jour{duration > 1 ? "s" : ""}
							</Text>
						</View>

						<Slider
							className="w-11/12 mx-auto"
							minimumValue={1}
							maximumValue={30}
							minimumTrackTintColor={theme.colors.primary}
							maximumTrackTintColor={theme.colors.textTertiary}
							value={duration}
							onValueChange={(value) => setDuration(value)}
							step={1}
							thumbTintColor={theme.colors.primary}
							aria-label="Slider days"
						/>
					</View>

					<Text
						style={{ color: theme.colors.textTertiary }}
						className="text-center py-3"
					>
						{JSON.stringify(selectedHabit)}
					</Text>

					<Pressable onPress={handleValidate} disabled={!canValidate}>
						<View
							style={{
								backgroundColor: canValidate
									? theme.colors.primary
									: theme.colors.grayPrimary,
							}}
							className="w-11/12 mx-auto rounded-xl py-2 my-3 flex flex-row items-center justify-center"
						>
							<Iconify icon="mdi-check" size={24} color={theme.colors.background} />
						</View>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
}
