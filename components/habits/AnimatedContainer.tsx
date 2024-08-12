import React, { ReactNode } from "react";
import Animated from "react-native-reanimated";

interface AnimatedContainerProps {
	animatedStyles: any; //TODO type
	children: ReactNode;
}

const AnimatedContainer = ({
	animatedStyles,
	children,
}: AnimatedContainerProps) => (
	<Animated.View
		style={[animatedStyles]}
		className="w-[90%] mx-auto my-2 flex flex-row items-center justify-evenly"
	>
		{children}
	</Animated.View>
);

export default AnimatedContainer;
