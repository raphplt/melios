import TopRow from "@components/Habits/TopRow";
import { View } from "react-native";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "./ButtonViewMore";
import { UserHabit } from "@type/userHabit";

const MissedHabitsSection = ({
	habits,
	onHabitStatusChange,
	showMoreMissed,
	updateShowMissed,
	resetShowMissed,
	theme,
	missedHabitsCount,
}: {
	habits: UserHabit[];
	onHabitStatusChange: (habit: UserHabit, done: boolean) => void;
	showMoreMissed: number;
	updateShowMissed: () => void;
	resetShowMissed: () => void;
	theme: any;
	missedHabitsCount: number;
}) => (
	<View
		className="flex flex-row flex-wrap justify-start py-1 mb-2"
		style={{ backgroundColor: "transparent" }}
	>
		<TopRow
			icon="time"
			color={theme.colors.background}
			borderColor={theme.colors.redPrimary}
			textColor={theme.colors.redPrimary}
			text="Plus tôt dans la journée"
			number={missedHabitsCount}
			resetShow={resetShowMissed}
			showMore={showMoreMissed}
		/>
		<View className="flex flex-col w-full">
			{habits.slice(0, showMoreMissed).map((habit: UserHabit) => (
				<CardCheckHabit
					key={habit.id}
					habit={habit}
					onHabitStatusChange={onHabitStatusChange}
					completed={false}
					disabled={false}
				/>
			))}
			{habits.length > 3 && showMoreMissed > 0 && (
				<ButtonViewMore
					onPress={updateShowMissed}
					text={null}
					listLength={showMoreMissed}
					maxLength={habits.length}
				/>
			)}
		</View>
	</View>
);

export default MissedHabitsSection;
