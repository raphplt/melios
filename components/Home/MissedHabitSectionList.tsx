import TopRow from "@components/Habits/TopRow";
import { View } from "react-native";
import { Habit } from "../../types/habit";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "./ButtonViewMore";

const MissedHabitsSection = ({
	habits,
	showMissingHabits,
	toggleShowMissingHabits,
	onHabitStatusChange,
	showMoreMissed,
	updateShowMissed,
	resetShowMissed,
}: any) => (
	<View
		className="flex flex-row flex-wrap justify-start py-2 mb-2"
		style={{ backgroundColor: "transparent" }}
	>
		<TopRow
			icon="close-circle"
			color={habits.theme.colors.background}
			borderColor={habits.theme.colors.redPrimary}
			textColor={habits.theme.colors.redPrimary}
			text="Manquées"
			number={habits.missedHabitsCount}
			resetShow={resetShowMissed}
			showMore={showMoreMissed}
		/>
		{showMissingHabits ? (
			<View className="flex flex-col w-full">
				{habits.data.slice(0, showMoreMissed).map((habit: Habit) => (
					<CardCheckHabit
						key={habit.id}
						habit={habit}
						onHabitStatusChange={onHabitStatusChange}
					/>
				))}
				<ButtonViewMore
					onPress={updateShowMissed}
					text={null}
					listLength={showMoreMissed}
				/>
			</View>
		) : (
			<ButtonViewMore
				onPress={toggleShowMissingHabits}
				text={null}
				listLength={showMoreMissed}
			/>
		)}
	</View>
);

export default MissedHabitsSection;
