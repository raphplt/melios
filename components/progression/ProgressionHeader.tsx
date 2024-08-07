import React from "react";
import { View } from "react-native";
import SetTime from "./SetTime";

const ProgressionHeader = ({
	activeButton,
	handlePress,
	theme,
}: {
	activeButton: string;
	handlePress: Function;
	theme: any;
}) => {
	return (
		<View
			className="w-full flex mt-3 items-center mx-auto justify-between flex-row"
			style={{ backgroundColor: theme.colors.background }}
		>
			{["Jour", "Semaine", "Mois", "Année"].map((timeFrame) => (
				<SetTime
					key={timeFrame}
					text={timeFrame}
					handlePress={handlePress}
					activeButton={activeButton}
				/>
			))}
		</View>
	);
};

export default ProgressionHeader;
