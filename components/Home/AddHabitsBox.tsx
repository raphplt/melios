import React from "react";
import GradientBox from "./GradientBox";
import AddHabits from "./AddHabits";

const AddHabitsBox = () => {
	return (
		<GradientBox position={{ bottom: 20, right: 20 }}>
			<AddHabits />
		</GradientBox>
	);
};

export default AddHabitsBox;
