import React from "react";
import { Pressable } from "react-native";
import Checkbox from "expo-checkbox";

const HabitCheckbox = ({
	toggleCheckBox,
	setHabitDone,
	theme,
	disabled,
}: any) => (
	<Pressable
		onPress={setHabitDone}
		className="flex items-center justify-center px-3 py-2"
		disabled={toggleCheckBox}
	>
		<Checkbox
			value={toggleCheckBox}
			onValueChange={setHabitDone}
			color={theme.colors.primary}
			disabled={disabled || toggleCheckBox}
		/>
	</Pressable>
);

export default HabitCheckbox;
