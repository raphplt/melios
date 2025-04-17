import React from "react";
import GradientBox from "./GradientBox";
import ViewToggle from "./ViewToggle";
import { useHabits } from "@context/HabitsContext";
import { useTheme } from "@context/ThemeContext";

const ViewBox = () => {
	const { viewMode, setViewMode } = useHabits();
	const { theme } = useTheme();
	return (
		<GradientBox
			position={{ bottom: 20, left: 20 }}
			colors={[theme.colors.background, theme.colors.backgroundTertiary]}
		>
			<ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
		</GradientBox>
	);
};

export default ViewBox;
