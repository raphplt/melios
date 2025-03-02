import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Dimensions,
	Animated,
	StyleSheet,
	Platform,
	StatusBar,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import * as Progress from "react-native-progress";
import ButtonClose from "@components/Shared/ButtonClose";

interface SessionOption {
	work: number; // en minutes
	break: number; // en minutes
	label: string;
}

const WorkSession: React.FC = () => {
	const { t } = useTranslation();
	const { theme } = useTheme();

	// Options de sessions disponibles
	const sessionOptions: SessionOption[] = [
		{ work: 1, break: 1, label: "1/1" },
		{ work: 20, break: 5, label: "20/5" },
		{ work: 25, break: 5, label: "25/5" },
		{ work: 50, break: 10, label: "50/10" },
	];

	// --- États de navigation ---
	// Lorsque false, on est sur l'écran de sélection de durée.
	const [isSessionStarted, setIsSessionStarted] = useState<boolean>(false);

	// --- États de configuration de la session ---
	const [selectedSession, setSelectedSession] = useState<SessionOption>(
		sessionOptions[0]
	);

	// --- États du timer ---
	// totalSeconds correspond à la durée de la période en cours (travail ou repos) en secondes
	const [totalSeconds, setTotalSeconds] = useState<number>(
		selectedSession.work * 60
	);
	// timerSeconds correspond au décompte restant en secondes
	const [timerSeconds, setTimerSeconds] = useState<number>(
		selectedSession.work * 60
	);
	// isTimerActive contrôle le démarrage / pause du timer
	const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
	// isWorkMode indique si l’on est en période de travail (true) ou de repos (false)
	const [isWorkMode, setIsWorkMode] = useState<boolean>(true);

	// --- États de gamification ---
	// Temps total écoulé (toutes périodes confondues) en secondes
	const [totalElapsedSeconds, setTotalElapsedSeconds] = useState<number>(0);
	// Nombre de cycles (chaque cycle correspond à une période de travail complétée)
	const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);

	// Les points Melios sont calculés : 1 point pour 30 minutes écoulées
	const meliosPoints = Math.floor(totalElapsedSeconds / (30 * 60));

	// Référence pour l’intervalle du timer
	const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

	// Animation de clignotement quand le timer est en pause
	const blinkAnim = useRef(new Animated.Value(1)).current;
	const animationRef = useRef<Animated.CompositeAnimation | null>(null);

	// --- Effet : Réinitialisation lors d'un changement d'option sur l'écran de sélection ---
	useEffect(() => {
		// Si la session n'est pas lancée, on met à jour le timer pour le mode travail
		if (!isSessionStarted) {
			const workDuration = selectedSession.work * 60;
			setTotalSeconds(workDuration);
			setTimerSeconds(workDuration);
		}
	}, [selectedSession, isSessionStarted]);

	// --- Effet : Gestion du timer ---
	useEffect(() => {
		if (isTimerActive) {
			timerInterval.current = setInterval(() => {
				setTimerSeconds((prev) => prev - 1);
				// On incrémente aussi le temps total écoulé
				setTotalElapsedSeconds((prev) => prev + 1);
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

	// --- Effet : Passage d'une période à l'autre ---
	useEffect(() => {
		if (timerSeconds <= 0 && isTimerActive) {
			if (isWorkMode) {
				// Fin de la période de travail
				// On incrémente le nombre de cycles complétés
				setCyclesCompleted((prev) => prev + 1);
				// Passage en mode repos
				const breakDuration = selectedSession.break * 60;
				setTotalSeconds(breakDuration);
				setTimerSeconds(breakDuration);
				setIsWorkMode(false);
			} else {
				// Fin de la période de repos : on passe au travail
				const workDuration = selectedSession.work * 60;
				setTotalSeconds(workDuration);
				setTimerSeconds(workDuration);
				setIsWorkMode(true);
			}
		}
	}, [timerSeconds, isTimerActive, isWorkMode, selectedSession]);

	// --- Effet : Animation de clignotement en pause ---
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

	// --- Fonctions de contrôle du timer ---
	const toggleTimer = (): void => {
		setIsTimerActive((prev) => !prev);
	};

	// Réinitialise la période en cours (sans toucher aux stats)
	const resetTimer = (): void => {
		setIsTimerActive(false);
		setTimerSeconds(totalSeconds);
	};

	// Quitte la session active et revient à l'écran de sélection (les stats sont réinitialisées)
	const quitSession = (): void => {
		setIsTimerActive(false);
		setIsSessionStarted(false);
		setTotalElapsedSeconds(0);
		setCyclesCompleted(0);
		// Réinitialisation sur la durée de travail de l'option sélectionnée
		const workDuration = selectedSession.work * 60;
		setTotalSeconds(workDuration);
		setTimerSeconds(workDuration);
		setIsWorkMode(true);
	};

	// Formate le temps en mm:ss
	const formatTime = (seconds: number): string => {
		const minutes: number = Math.floor(seconds / 60);
		const secs: number = seconds % 60;
		return `${minutes < 10 ? "0" : ""}${minutes}:${secs < 10 ? "0" : ""}${secs}`;
	};

	// Composant affichant le timer avec sa progression
	const TimerProgressBar = (): JSX.Element => {
		const { width } = Dimensions.get("window");
		const progressValue: number = 1 - timerSeconds / totalSeconds;
		// Couleur dynamique en fonction du mode (travail / repos)
		const sessionColor = isWorkMode
			? theme.colors.primary
			: theme.colors.secondary || theme.colors.primaryLight;
		return (
			<View className="flex flex-col items-center justify-between">
				<Text style={[styles.modeLabel, { color: theme.colors.text }]}>
					{isWorkMode ? t("Mode Travail") : t("Mode Repos")}
				</Text>
				<View className="flex flex-col relative items-center justify-center">
					<Progress.Circle
						size={width * 0.75}
						thickness={10}
						progress={progressValue}
						borderColor="transparent"
						unfilledColor={theme.colors.border}
						color={sessionColor}
						borderWidth={0}
					/>
					<Animated.Text
						style={[
							{
								color: theme.colors.text,
								opacity: isTimerActive ? 1 : blinkAnim,
							},
						]}
						className="absolute text-4xl font-bold"
					>
						{formatTime(timerSeconds)}
					</Animated.Text>
				</View>
			</View>
		);
	};

	// --- Vue de sélection de session ---
	const SelectionView = (): JSX.Element => (
		<View
			className="h-full"
			style={{
				paddingTop: 40,
				backgroundColor: theme.colors.background,
			}}
		>
			<ButtonClose />
			<View className="flex flex-col items-center justify-around flex-1">
				<Text
					className="text-2xl font-bold text-center mb-4"
					style={{ color: theme.colors.text }}
				>
					{t("Choisissez votre session")}
				</Text>
				<View style={styles.optionsRow}>
					{sessionOptions.map((option: SessionOption, index: number) => (
						<TouchableOpacity
							key={index}
							onPress={() => setSelectedSession(option)}
							style={{
								backgroundColor:
									selectedSession.label === option.label
										? theme.colors.primary
										: theme.colors.cardBackground,
							}}
							className="rounded-full p-4 px-6"
						>
							<Text
								style={{
									color:
										selectedSession.label === option.label
											? theme.colors.textSecondary
											: theme.colors.text,
									fontWeight: "600",
								}}
							>
								{option.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				<TouchableOpacity
					className="w-11/12 rounded-full mx-auto flex items-center justify-center p-4"
					style={{ backgroundColor: theme.colors.primary }}
					onPress={() => {
						const workDuration = selectedSession.work * 60;
						setTotalSeconds(workDuration);
						setTimerSeconds(workDuration);
						setIsWorkMode(true);
						setTotalElapsedSeconds(0);
						setCyclesCompleted(0);
						setIsSessionStarted(true);
					}}
				>
					<Text style={[styles.startButtonText, { color: "#fff" }]}>
						{t("Commencer")}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	// --- Vue du timer actif avec le panneau de stats et les boutons de contrôle ---
	const TimerView = (): JSX.Element => (
		<View
			className="h-full flex flex-col flex-1 items-center justify-between"
			style={{
				paddingTop: Platform.OS == "ios" ? 60 : StatusBar.currentHeight,
				backgroundColor: theme.colors.background,
			}}
		>
			{/* Panneau de stats */}
			<View className="flex flex-row justify-around items-center w-full">
				<View style={styles.statItem}>
					<Text style={[styles.statLabel, { color: theme.colors.text }]}>
						{t("Temps total")}
					</Text>
					<Text style={[styles.statValue, { color: theme.colors.text }]}>
						{Math.floor(totalElapsedSeconds / 60)} {t("min")}
					</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statLabel, { color: theme.colors.text }]}>
						{t("Cycles")}
					</Text>
					<Text style={[styles.statValue, { color: theme.colors.text }]}>
						{cyclesCompleted}
					</Text>
				</View>
				<View style={styles.statItem}>
					<Text style={[styles.statLabel, { color: theme.colors.text }]}>
						{t("Points Melios")}
					</Text>
					<Text style={[styles.statValue, { color: theme.colors.text }]}>
						{meliosPoints}
					</Text>
				</View>
			</View>
			{/* Zone du timer */}
			<TimerProgressBar />
			{/* Boutons de contrôle */}
			<View style={styles.controlsContainer}>
				<TouchableOpacity
					style={[
						styles.controlButton,
						{ backgroundColor: theme.colors.greenPrimary },
					]}
					onPress={toggleTimer}
				>
					<Text style={[styles.controlButtonText, { color: "#fff" }]}>
						{isTimerActive ? t("Pause") : t("Démarrer")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.controlButton,
						{ backgroundColor: theme.colors.redPrimary },
					]}
					onPress={resetTimer}
				>
					<Text style={[styles.controlButtonText, { color: "#fff" }]}>
						{t("Réinitialiser")}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.controlButton,
						{ backgroundColor: theme.colors.grayPrimary || "#888" },
					]}
					onPress={quitSession}
				>
					<Text style={[styles.controlButtonText, { color: "#fff" }]}>
						{t("Quitter")}
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);

	// Rendu conditionnel en fonction de l'état de la session
	return isSessionStarted ? <TimerView /> : <SelectionView />;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: 40,
		paddingHorizontal: 20,
		justifyContent: "space-between",
	},
	headerText: {
		fontSize: 24,
		fontWeight: "700",
		textAlign: "center",
		marginBottom: 20,
	},
	optionsRow: {
		flexDirection: "row",
		justifyContent: "center",
		flexWrap: "wrap",
		gap: 10,
	},
	optionButton: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 10,
		borderWidth: 2,
		margin: 5,
	},
	startButton: {
		paddingVertical: 15,
		borderRadius: 10,
		marginTop: 30,
		alignItems: "center",
	},
	startButtonText: {
		fontSize: 18,
		fontWeight: "700",
	},
	timerContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	modeLabel: {
		fontSize: 20,
		fontWeight: "700",
		marginBottom: 10,
	},
	progressContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	statsContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginBottom: 20,
	},
	statItem: {
		alignItems: "center",
	},
	statLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
	statValue: {
		fontSize: 16,
		fontWeight: "700",
	},
	controlsContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		marginBottom: 30,
	},
	controlButton: {
		flex: 1,
		marginHorizontal: 5,
		paddingVertical: 12,
		borderRadius: 50,
		alignItems: "center",
	},
	controlButtonText: {
		fontSize: 16,
		fontWeight: "600",
	},
});

export default WorkSession;
