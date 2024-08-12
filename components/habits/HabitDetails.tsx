import React, { useContext, useEffect, useState } from "react";
import { withSpring } from "react-native-reanimated";

// Customs paths
import { setMemberHabitLog } from "@db/member";
import { setRewards } from "@db/rewards";
import usePoints from "@hooks/usePoints";
import HabitDetails from "./HabitDetails";
import AnimatedContainer from "./AnimatedContainer";
import {
	useAnimation,
	useCurrentDate,
	useHabitInfos,
} from "@hooks/useCardCheckHabit";
import HabitCheckbox from "./HabitCheckBox";
import { difficulties } from "@utils/habitsUtils";
import { ThemeContext } from "@context/ThemeContext";
import { navigation } from "@utils/navigation";

export default function CardCheckHabit({
	habit = [],
	onHabitStatusChange,
	completed,
	disabled,
}: any) {
	const { theme } = useContext(ThemeContext);
	const [toggleCheckBox, setToggleCheckBox] = useState(false);
	const date = useCurrentDate();
	const habitInfos = useHabitInfos(habit.id);
	const { addOdysseePoints } = usePoints();
	const { animatedStyles, translateX } = useAnimation();

	useEffect(() => {
		if (completed) {
			setToggleCheckBox(true);
		}
	}, [completed]);

	const setHabitDone = async () => {
		setToggleCheckBox(true);
		onHabitStatusChange(habit, true);
		translateX.value = withSpring(toggleCheckBox ? 100 : 0);
		await setMemberHabitLog(habit.id, date, true);
		await setRewards("odyssee", habitInfos.reward + habitInfos.difficulty);
		addOdysseePoints(habitInfos.reward, habitInfos.difficulty);
	};

	return (
		<AnimatedContainer animatedStyles={animatedStyles}>
			<HabitCheckbox
				toggleCheckBox={toggleCheckBox}
				setHabitDone={setHabitDone}
				theme={theme}
				disabled={disabled}
			/>
			<HabitDetails
				habit={habit}
				habitInfos={habitInfos}
				theme={theme}
				navigation={navigation}
				completed={completed}
				difficulties={difficulties}
			/>
		</AnimatedContainer>
	);
}
