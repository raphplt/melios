import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated } from "react-native";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";

export enum ViewMode {
	LIST = "list",
	CALENDAR = "calendar",
}

type ViewToggleProps = {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
};

const BUTTON_WIDTH = 36;
const BUTTON_HEIGHT = 36;
const INDICATOR_MARGIN = 2;
const INDICATOR_RADIUS = 12;

const ViewToggle = ({ viewMode, setViewMode }: ViewToggleProps) => {
	const { theme } = useTheme();

	const translateX = useRef(
		new Animated.Value(viewMode === ViewMode.LIST ? 0 : 1)
	).current;

	useEffect(() => {
		Animated.timing(translateX, {
			toValue: viewMode === ViewMode.LIST ? 0 : 1,
			duration: 250,
			useNativeDriver: true,
		}).start();
	}, [viewMode]);

	const indicatorPosition = translateX.interpolate({
		inputRange: [0, 1],
		outputRange: [0, BUTTON_WIDTH + INDICATOR_MARGIN],
	});

	return (
		<View
			style={[
				styles.container,
				{
					height: BUTTON_HEIGHT + INDICATOR_MARGIN * 2 + 2,
					padding: INDICATOR_MARGIN,
				},
			]}
		>
			<Animated.View
				style={[
					styles.indicator,
					{
						backgroundColor: theme.colors.primary,
						width: BUTTON_WIDTH,
						height: BUTTON_HEIGHT,
						borderRadius: INDICATOR_RADIUS,
						transform: [{ translateX: indicatorPosition }],
						top: (BUTTON_HEIGHT + INDICATOR_MARGIN * 2 + 2 - BUTTON_HEIGHT) / 2,
						left: INDICATOR_MARGIN,
					},
				]}
			/>
			<Pressable
				style={[styles.button, { width: BUTTON_WIDTH, height: BUTTON_HEIGHT }]}
				onPress={() => setViewMode(ViewMode.LIST)}
			>
				<Iconify icon="mdi:format-list-bulleted" size={20} color="white" />
			</Pressable>
			<Pressable
				style={[styles.button, { width: BUTTON_WIDTH, height: BUTTON_HEIGHT }]}
				onPress={() => setViewMode(ViewMode.CALENDAR)}
			>
				<Iconify icon="mdi:calendar-month" size={20} color="white" />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		borderRadius: 999,
		margin: 0,
		position: "relative",
		justifyContent: "space-between",
		alignItems: "center",
	},
	indicator: {
		position: "absolute",
		zIndex: 0,
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 8,
		zIndex: 1,
	},
});

export default ViewToggle;