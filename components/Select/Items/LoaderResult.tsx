import { useTheme } from "@context/ThemeContext";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Text, View } from "react-native";
import * as Progress from "react-native-progress";

const LoaderResult = () => {
	const [progress, setProgress] = useState(0);
	const { t } = useTranslation();
	const { theme } = useTheme();

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prevProgress) => {
				if (prevProgress >= 1) {
					clearInterval(interval);
					return 1;
				}
				return prevProgress + 0.02;
			});
		}, 20);

		return () => clearInterval(interval);
	}, []);

	const width = Dimensions.get("window").width;

	return (
		<View className="h-full flex items-center justify-center gap-4">
			<Text
				style={{
					color: theme.colors.text,
				}}
				className="text-lg font-semibold"
			>
				{t("create_routine_loader")}
			</Text>
			<Progress.Bar
				progress={progress}
				width={width * 0.9}
				color={theme.colors.primary}
				unfilledColor={theme.colors.border}
				borderWidth={0}
				height={10}
			/>
		</View>
	);
};

export default LoaderResult;
