import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import useIndex from "@hooks/useIndex";

interface BlurBoxProps {
	position: {
		top?: number;
		left?: number;
		right?: number;
		bottom?: number;
	};
	children: React.ReactNode;
	borderColor?: string;
	borderWidth?: number;
	tint?: "light" | "dark" | "default";
}

const BlurBox: React.FC<BlurBoxProps> = ({
	position,
	borderColor,
	borderWidth,
	tint,
	children,
}) => {
	const { isDayTime } = useIndex();
	return (
		<View
			style={[
				position,
				{
					borderWidth: borderWidth ?? 0,
					borderColor: borderColor ?? "transparent",
				},
			]}
			className="absolute z-30 px-2 py-2 rounded-lg overflow-hidden"
		>
			<BlurView
				intensity={100}
				style={styles.blurView}
				tint={tint ? tint : isDayTime ? "light" : "dark"}
			/>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	blurView: {
		...StyleSheet.absoluteFillObject,
		borderRadius: 10,
	},
});

export default BlurBox;
