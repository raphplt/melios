import { View } from "react-native";

// Customs imports
import useIndex from "@hooks/useIndex";
import Congratulations from "./Congratulations";
import NoHabits from "./NoHabits";
import HabitSectionList from "./HabitSectionList";
import MissedHabitsSection from "./MissedHabitSectionList";
import { UserHabit } from "@type/userHabit";

export default function ListHabitsHome() {
	const {
		theme,
		userHabits,

		showMoreValidate,
		showMoreNext,
		showMoreMissed,
		missedHabitsCount,
		uncompletedHabitsData,
		completedHabitsData,
		hours,

		updateShowValidate,
		updateShowNext,
		updateShowMissed,
		handleHabitStatusChange,
		resetShowNext,
		resetShowValidate,
		resetShowMissed,
	} = useIndex();

	if (userHabits.length === 0 || !userHabits) return <NoHabits />;

	const nextHabits = uncompletedHabitsData.filter(
		(habit: UserHabit) => habit.moment >= hours
	);
	const missedHabits = uncompletedHabitsData.filter(
		(habit: UserHabit) => habit.moment < hours
	);

	return (
		<View
			className="flex flex-row flex-wrap justify-center mt-2"
			style={{ backgroundColor: "transparent" }}
		>
			{nextHabits.length > 0 ? (
				<HabitSectionList
					title="Prochaines habitudes"
					icon="ia"
					borderColor={theme.colors.primary}
					textColor={theme.colors.primary}
					habits={nextHabits}
					showMore={showMoreNext}
					onShowMore={updateShowNext}
					onHabitStatusChange={handleHabitStatusChange}
					resetShow={resetShowNext}
				/>
			) : (
				<Congratulations
					theme={theme}
					completedHabitsData={completedHabitsData}
					userHabits={userHabits}
				/>
			)}

			{missedHabits.length > 0 && (
				<MissedHabitsSection
					habits={missedHabits}
					missedHabitsCount={missedHabitsCount}
					theme={theme}
					onHabitStatusChange={handleHabitStatusChange}
					showMoreMissed={showMoreMissed}
					updateShowMissed={updateShowMissed}
					resetShowMissed={resetShowMissed}
				/>
			)}

			<HabitSectionList
				title="Validées"
				icon="check"
				borderColor={theme.colors.greenPrimary}
				textColor={theme.colors.greenPrimary}
				habits={completedHabitsData}
				showMore={showMoreValidate}
				onShowMore={updateShowValidate}
				onHabitStatusChange={handleHabitStatusChange}
				completed={true}
				disabled={true}
				resetShow={resetShowValidate}
			/>
		</View>
	);
}
