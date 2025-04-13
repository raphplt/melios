import React, { useEffect, useRef } from "react";
import {
	View,
	Pressable,
	StyleSheet,
	Animated,
	Text,
	Dimensions,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";

export enum HabitFilterMode {
	ALL = "all",
	POSITIVE = "positive",
	NEGATIVE = "negative",
}

type HabitToggleProps = {
	filterMode: HabitFilterMode;
	setFilterMode: (mode: HabitFilterMode) => void;
};

const HabitToggle = ({ filterMode, setFilterMode }: HabitToggleProps) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const translateX = useRef(
		new Animated.Value(
			filterMode === HabitFilterMode.ALL
				? 0
				: filterMode === HabitFilterMode.POSITIVE
				? 1
				: 2
		)
	).current;

	useEffect(() => {
		Animated.timing(translateX, {
			toValue:
				filterMode === HabitFilterMode.ALL
					? 0
					: filterMode === HabitFilterMode.POSITIVE
					? 1
					: 2,
			duration: 250,
			useNativeDriver: true,
		}).start();
	}, [filterMode]);

	const containerWidth = Dimensions.get("window").width - 24;
	const buttonWidth = containerWidth / 3;

	const indicatorPosition = translateX.interpolate({
		inputRange: [0, 1, 2],
		outputRange: [0, buttonWidth, buttonWidth * 2],
	});

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.colors.cardBackground,
					width: containerWidth,
				},
			]}
		>
			<Animated.View
				style={[
					styles.indicator,
					{
						backgroundColor: theme.colors.primary,
						transform: [{ translateX: indicatorPosition }],
						width: buttonWidth - 8,
					},
				]}
			/>

			<Pressable
				style={styles.button}
				onPress={() => setFilterMode(HabitFilterMode.ALL)}
			>
				<Text
					style={{
						color:
							filterMode === HabitFilterMode.ALL ? "white" : theme.colors.textTertiary,
						fontWeight: "600",
					}}
				>
					{t("all")}
				</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => setFilterMode(HabitFilterMode.POSITIVE)}
			>
				<Text
					style={{
						color:
							filterMode === HabitFilterMode.POSITIVE
								? "white"
								: theme.colors.textTertiary,
						fontWeight: "600",
					}}
				>
					{t("positive")}
				</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => setFilterMode(HabitFilterMode.NEGATIVE)}
			>
				<Text
					style={{
						color:
							filterMode === HabitFilterMode.NEGATIVE
								? "white"
								: theme.colors.textTertiary,
						fontWeight: "600",
					}}
				>
					{t("negative")}
				</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderRadius: 20,
		margin: 6,
		padding: 4,
		position: "relative",
		alignSelf: "center",
	},
	indicator: {
		position: "absolute",
		height: 38,
		borderRadius: 16,
		top: 4,
		left: 4,
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		borderRadius: 16,
		zIndex: 1,
		flex: 1,
	},
});

export default HabitToggle;
