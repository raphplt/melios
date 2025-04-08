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

	const buttonWidth = 42;
	const indicatorPosition = translateX.interpolate({
		inputRange: [0, 1],
		outputRange: [0, buttonWidth],
	});

	return (
		<View
			style={[styles.container, { backgroundColor: theme.colors.cardBackground }]}
		>
			<Animated.View
				style={[
					styles.indicator,
					{
						backgroundColor: theme.colors.primary,
						transform: [{ translateX: indicatorPosition }],
					},
				]}
			/>

			<Pressable style={styles.button} onPress={() => setViewMode(ViewMode.LIST)}>
				<Iconify
					icon="mdi:format-list-bulleted"
					size={22}
					color={viewMode === ViewMode.LIST ? "white" : theme.colors.textTertiary}
				/>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => setViewMode(ViewMode.CALENDAR)}
			>
				<Iconify
					icon="mdi:calendar-month"
					size={22}
					color={
						viewMode === ViewMode.CALENDAR ? "white" : theme.colors.textTertiary
					}
				/>
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
		justifyContent: "space-between",
	},
	indicator: {
		position: "absolute",
		width: 42,
		height: 38,
		borderRadius: 10,
		top: 4,
		left: 4,
	},
	button: {
		alignItems: "center",
		justifyContent: "center",
		padding: 8,
		borderRadius: 10,
		zIndex: 1,
		width: 42,
	},
});

export default ViewToggle;
