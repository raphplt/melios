import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Animated,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";
import ButtonClose from "@components/Shared/ButtonClose";

interface SessionOption {
	work: number;
	break: number;
	label: string;
}

const WorkSession: React.FC = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	const sessionOptions: SessionOption[] = [
		{ work: 20, break: 5, label: "20/5" },
		{ work: 25, break: 5, label: "25/5" },
		{ work: 50, break: 10, label: "50/10" },
		{ work: 90, break: 20, label: "90/20" },
	];

	const [selectedSession, setSelectedSession] = useState<SessionOption>(
		sessionOptions[0]
	);
	const [totalSeconds, setTotalSeconds] = useState<number>(
		selectedSession.work * 60
	);
	const [timerSeconds, setTimerSeconds] = useState<number>(
		selectedSession.work * 60
	);
	const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

	const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

	// Animation de clignotement (quand le timer est en pause)
	const blinkAnim = useRef(new Animated.Value(1)).current;
	const animationRef = useRef<Animated.CompositeAnimation | null>(null);

	useEffect(() => {
		const newTotal = selectedSession.work * 60;
		setTotalSeconds(newTotal);
		setTimerSeconds(newTotal);
		setIsTimerActive(false);
		if (timerInterval.current) {
			clearInterval(timerInterval.current);
			timerInterval.current = null;
		}
	}, [selectedSession]);

	useEffect(() => {
		if (isTimerActive) {
			timerInterval.current = setInterval(() => {
				setTimerSeconds((prev) => {
					if (prev > 0) {
						return prev - 1;
					} else {
						if (timerInterval.current) {
							clearInterval(timerInterval.current);
							timerInterval.current = null;
						}
						setIsTimerActive(false);
						return 0;
					}
				});
			}, 1000);
		} else {
			if (timerInterval.current) {
				clearInterval(timerInterval.current);
				timerInterval.current = null;
			}
		}
		return () => {
			if (timerInterval.current) {
				clearInterval(timerInterval.current);
				timerInterval.current = null;
			}
		};
	}, [isTimerActive]);

	useEffect(() => {
		if (!isTimerActive) {
			animationRef.current = Animated.loop(
				Animated.sequence([
					Animated.timing(blinkAnim, {
						toValue: 0,
						duration: 0,
						useNativeDriver: true,
					}),
					Animated.delay(500),
					Animated.timing(blinkAnim, {
						toValue: 1,
						duration: 0,
						useNativeDriver: true,
					}),
					Animated.delay(500),
				])
			);
			animationRef.current.start();
		} else {
			if (animationRef.current) {
				animationRef.current.stop();
			}
			blinkAnim.setValue(1);
		}
	}, [isTimerActive, blinkAnim]);

	const toggleTimer = (): void => {
		setIsTimerActive((prev) => !prev);
	};

	const resetTimer = (): void => {
		setIsTimerActive(false);
		setTimerSeconds(totalSeconds);
	};

	const formatTime = (seconds: number): string => {
		const minutes: number = Math.floor(seconds / 60);
		const secs: number = seconds % 60;
		return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
	};

	const TimerProgressBar = (): JSX.Element => {
		const { width } = Dimensions.get("window");
		const progressValue: number = 1 - timerSeconds / totalSeconds;
		return (
			<View
				style={{
					paddingVertical: 20,
					alignItems: "center",
					justifyContent: "center",
				}}
				className="flex-1"
			>
				<Progress.Circle
					size={width * 0.75}
					thickness={10}
					progress={progressValue}
					borderColor="transparent"
					unfilledColor={theme.colors.border}
					color={theme.colors.primary}
					borderWidth={0}
				/>
				<Animated.Text
					style={{
						color: theme.colors.text,
						opacity: blinkAnim,
						fontSize: 60,
						fontWeight: "600",
						position: "absolute",
					}}
				>
					{formatTime(timerSeconds)}
				</Animated.Text>
			</View>
		);
	};

	return (
		<View
			style={{ flex: 1, backgroundColor: theme.colors.background, paddingTop: 40 }}
		>
			<View
				style={{ paddingHorizontal: 20, paddingVertical: 20 }}
				className="flex flex-row items-center justify-between"
			>
				<View style={{ flex: 1, alignItems: "flex-start" }}>
					<ButtonClose />
				</View>
				<View style={{ flex: 4, alignItems: "center" }}>
					<Text
						style={{
							color: theme.colors.text,
							fontSize: 20,
							fontFamily: theme.fonts.bold.fontFamily,
							textAlign: "center",
						}}
					>
						{t("Session de Travail")}
					</Text>
				</View>
				<View style={{ flex: 1 }} />
			</View>

			<View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
				<View style={{ flexDirection: "row", justifyContent: "center" }}>
					{sessionOptions.map((option: SessionOption, index: number) => (
						<TouchableOpacity
							key={index}
							onPress={() => setSelectedSession(option)}
							style={{
								paddingVertical: 10,
								paddingHorizontal: 20,
								borderRadius: 10,
								borderWidth: 2,
								borderColor:
									selectedSession.label === option.label
										? theme.colors.primary
										: theme.colors.border,
								backgroundColor:
									selectedSession.label === option.label
										? theme.colors.primaryLight
										: theme.colors.cardBackground,
								marginHorizontal: 5,
							}}
						>
							<Text
								style={{
									color: theme.colors.text,
								}}
								className="font-semibold"
							>
								{option.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>

			<TimerProgressBar />

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-evenly",
					padding: 20,
				}}
			>
				<TouchableOpacity
					className="w-[45%] p-3 rounded-full"
					onPress={toggleTimer}
					style={{
						backgroundColor: theme.colors.greenPrimary,
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontFamily: theme.fonts.bold.fontFamily,
						}}
						className="text-center text-lg mx-2"
					>
						{isTimerActive ? t("Pause") : t("Démarrer")}
					</Text>
				</TouchableOpacity>

				<TouchableOpacity
					className="w-[45%] p-3 rounded-full"
					onPress={resetTimer}
					style={{
						backgroundColor: theme.colors.redPrimary,
					}}
				>
					<Text
						style={{
							color: "#fff",
							fontFamily: theme.fonts.bold.fontFamily,
						}}
						className="text-center text-lg mx-2"
					>
						{t("Réinitialiser")}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default WorkSession;
