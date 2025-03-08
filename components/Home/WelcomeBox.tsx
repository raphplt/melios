import React from "react";
import WelcomeRow from "./WelcomeRow";
import GradientBox from "./GradientBox";

const WelcomeBox = () => {
	return (
		<GradientBox position={{ top: 20, left: 20 }}>
			<WelcomeRow />
		</GradientBox>
	);
};

export default WelcomeBox;
