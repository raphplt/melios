import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import RowTitleCustom from "./RowTitleCustom";
import { Iconify } from "react-native-iconify";
import Animated, {
	useSharedValue,
	useAnimatedStyle,
	withTiming,
	interpolateColor,
} from "react-native-reanimated";

type ConfidentialitySelectorProps = {
	value: "public" | "private" | "friends";
	onChange: (value: "public" | "private" | "friends") => void;
};

type Option = {
	label: string;
	value: "public" | "private" | "friends";
};

type AnimatedOptionProps = {
	option: Option;
	selected: boolean;
	onPress: (value: "public" | "private" | "friends") => void;
	theme: any;
	renderIcon: (name: string, selected: boolean) => React.ReactNode;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AnimatedOption: React.FC<AnimatedOptionProps> = ({
	option,
	selected,
	onPress,
	theme,
	renderIcon,
}) => {
	const progress = useSharedValue(selected ? 1 : 0);

	useEffect(() => {
		progress.value = withTiming(selected ? 1 : 0, { duration: 300 });
	}, [selected]);

	const animatedStyle = useAnimatedStyle(() => ({
		backgroundColor: interpolateColor(
			progress.value,
			[0, 1],
			[theme.colors.border, theme.colors.primary]
		),
	}));

	return (
		<AnimatedPressable
			onPress={() => onPress(option.value)}
			style={[
				animatedStyle,
				{
					borderRadius: 10,
					paddingVertical: 12,
					paddingHorizontal: 24,
					marginHorizontal: 4,
				},
			]}
		>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				{renderIcon(option.value, selected)}
				<Text
					style={{
						color: selected ? theme.colors.textSecondary : theme.colors.text,
						fontSize: 14,
						marginLeft: 8,
					}}
				>
					{option.label}
				</Text>
			</View>
		</AnimatedPressable>
	);
};

const ConfidentialitySelectorHabit: React.FC<ConfidentialitySelectorProps> = ({
	value,
	onChange,
}) => {
	const { theme } = useTheme();
	const { t } = useTranslation();

	const options: Option[] = [
		{ label: t("public"), value: "public" },
		{ label: t("private"), value: "private" },
		{ label: t("friends"), value: "friends" },
	];

	const renderIcon = (name: string, selected: boolean) => {
		switch (name) {
			case "public":
				return (
					<Iconify
						icon="mynaui:globe"
						size={18}
						color={selected ? theme.colors.textSecondary : theme.colors.text}
					/>
				);
			case "private":
				return (
					<Iconify
						icon="material-symbols:lock"
						size={18}
						color={selected ? theme.colors.textSecondary : theme.colors.text}
					/>
				);
			case "friends":
				return (
					<Iconify
						icon="ion:people"
						size={18}
						color={selected ? theme.colors.textSecondary : theme.colors.text}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<>
			<RowTitleCustom title="CONFIDENTIALITÉ" />

			<View
				style={{
					borderRadius: 10,
					paddingHorizontal: 16,
					paddingVertical: 12,
					marginTop: 4,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					backgroundColor: theme.colors.cardBackground,
					width: "100%",
				}}
			>
				{options.map((option) => (
					<AnimatedOption
						key={option.value}
						option={option}
						selected={value === option.value}
						onPress={onChange}
						theme={theme}
						renderIcon={renderIcon}
					/>
				))}
			</View>
		</>
	);
};

export default ConfidentialitySelectorHabit;
