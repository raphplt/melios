import TopRow from "@components/Habits/TopRow";
import { View } from "react-native";
import { Habit } from "../../type/habit";
import CardCheckHabit from "@components/Habits/CardCheckHabit";
import ButtonViewMore from "./ButtonViewMore";
import { UserHabit } from "@type/userHabit";

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
}: {
	title: string;
	icon: string;
	borderColor: string;
	textColor: string;
	habits: UserHabit[];
	showMore: number;
	onShowMore: () => void;
	onHabitStatusChange: (habit: UserHabit, done: boolean) => void;
	completed?: boolean;
	disabled?: boolean;
	resetShow: () => void;
}) => (
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
			{habits.slice(0, showMore).map((habit: UserHabit) => (
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
