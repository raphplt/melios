import TopRow from "@components/Habits/TopRow";
import { View } from "react-native";
import { Habit } from "../../types/habit";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "./ButtonViewMore";

const HabitSectionList = ({
	title,
	icon,
	borderColor,
	textColor,
	habits,
	showMore,
	onShowMore,
	onHabitStatusChange,
	completed = false,
	disabled = false,
	resetShow,
}: any) => (
	<View
		className="flex flex-row flex-wrap justify-start py-1 mb-2"
		style={{ backgroundColor: "transparent" }}
	>
		<TopRow
			icon={icon}
			color={"white"}
			borderColor={borderColor}
			textColor={textColor}
			text={title}
			number={habits.length}
			resetShow={resetShow}
			showMore={showMore}
		/>
		<View className="w-full mx-auto">
			{habits.slice(0, showMore).map((habit: Habit) => (
				<CardCheckHabit
					key={habit.id}
					habit={habit}
					onHabitStatusChange={onHabitStatusChange}
					completed={completed}
					disabled={disabled}
				/>
			))}
			{habits.length > 3 && showMore > 0 && (
				<ButtonViewMore
					onPress={onShowMore}
					text={null}
					listLength={showMore}
					maxLength={habits.length}
				/>
			)}
		</View>
	</View>
);

export default HabitSectionList;
