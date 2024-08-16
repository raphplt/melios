import { View, Text } from "react-native";
import { UserHabit } from "../../types/userHabit";
import { Iconify } from "react-native-iconify";

export default function CardHabitCompleted({
	habit,
	habitLastDaysCompleted,
	activeButton,
	dateLength,
	index,
	theme,
}: {
	habit: UserHabit;
	habitLastDaysCompleted: any;
	activeButton: string;
	dateLength: number;
	index: number;
	theme: any;
}) {
	const notToday = activeButton !== "Jour";

	return (
		<View
			key={index}
			className="drop-shadow-md flex flex-row items-center justify-between px-5 my-2 py-2 mx-auto w-11/12 rounded-xl"
			style={{
				borderColor:
					habitLastDaysCompleted[habit.name] >= dateLength
						? theme.colors.primary
						: theme.colors.border,
				borderWidth: 1,
				backgroundColor:
					habitLastDaysCompleted[habit.name] >= dateLength
						? "rgba(8, 32, 159, 0.1)"
						: theme.colors.cardBackground,
			}}
		>
			{notToday && (
				<View
					className=" absolute top-0 bottom-0 rounded-l-xl left-0 opacity-40"
					style={{
						width: `${(habitLastDaysCompleted[habit.name] / dateLength) * 100}%`,
						backgroundColor: theme.colors.primary,
					}}
				/>
			)}
			<Text
				style={{
					color: theme.colors.text,
				}}
			>
				{habit.name}
			</Text>
			<View>
				{activeButton === "Jour" ? (
					habitLastDaysCompleted[habit.name] ? (
						<Iconify
							icon="icon-park-solid:check-one"
							size={24}
							color={theme.colors.primary}
						/>
					) : (
						<Iconify
							icon="tabler:circle-dotted"
							size={24}
							color={theme.colors.text}
						/>
					)
				) : (
					<Text
						style={{
							color: theme.colors.text,
						}}
					>
						{habitLastDaysCompleted[habit.name]} /{" "}
						{activeButton === "Semaine" ? 7 : activeButton === "Mois" ? 30 : 365}
					</Text>
				)}
			</View>
		</View>
	);
}
