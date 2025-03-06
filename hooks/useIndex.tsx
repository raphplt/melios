import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
	useNavigation,
	ParamListBase,
	NavigationProp,
	useIsFocused,
} from "@react-navigation/native";
import { useTheme } from "@context/ThemeContext";
import { Animated } from "react-native";
import { useData } from "@context/DataContext";
import { UserHabit } from "../type/userHabit";
import { getMemberInfos } from "@db/member";
import { isDayTime } from "@utils/timeUtils";
import { Habit } from "@type/habit";
import { useHabits } from "@context/HabitsContext";
import { getUserHabits } from "@db/userHabit";
import { getCachedImage } from "@db/files";

const useIndex = () => {
	// Contexte et hooks
	const { theme } = useTheme();
	const { member, setMember, habits, isLoading } = useData();
	const { habitsData } = useHabits();
	const isFocused = useIsFocused();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	// Refs
	const rotation = useRef(new Animated.Value(0)).current;
	const abortControllerHabits = useRef<AbortController | null>(null);
	const abortControllerMember = useRef<AbortController | null>(null);

	// États locaux
	const [userHabits, setUserHabits] = useState<UserHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [hours, setHours] = useState<number>(new Date().getHours());
	const [welcomeMessage, setWelcomeMessage] = useState("Bienvenue !");
	const [showMissingHabits, setShowMissingHabits] = useState(false);
	const [imageTemple, setImageTemple] = useState<string | null>(null);

	// Animation : création d'une valeur interpolée stable
	const rotate = useMemo(() => {
		return rotation.interpolate({
			inputRange: [0, 1],
			outputRange: ["0deg", "360deg"],
		});
	}, [rotation]);

	// Gestion des erreurs, mémorisée pour une référence stable
	const handleError = useCallback((error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes :", error);
	}, []);

	// Récupération de l'image en cache
	useEffect(() => {
		let isMounted = true;
		const fetchImage = async () => {
			try {
				const name = isDayTime ? "temple_day.jpg" : "temple_night.jpg";
				const localUri = await getCachedImage(`images/illustrations/${name}`);
				if (isMounted) {
					setImageTemple(localUri);
				}
			} catch (error) {
				console.error("Failed to fetch image:", error);
			}
		};

		fetchImage();
		return () => {
			isMounted = false;
		};
	}, [isDayTime]);

	// Récupération des infos du membre (seulement si non défini)
	const fetchMemberInfosData = useCallback(
		async (signal: AbortSignal) => {
			if (member) return;
			try {
				console.log("Fetching member infos data");
				const memberInfos = await getMemberInfos();
				if (!signal.aborted) {
					setMember(memberInfos);
				}
			} catch (error) {
				if (!signal.aborted) {
					handleError(error);
				}
			}
		},
		[member, setMember, handleError]
	);

	// Lancement du fetch de member quand l'écran est focus
	useEffect(() => {
		if (!isFocused) return;
		if (!member) {
			// Abort de la précédente requête si existante
			abortControllerMember.current?.abort();
			abortControllerMember.current = new AbortController();
			fetchMemberInfosData(abortControllerMember.current.signal);
		}
	}, [isFocused, member, fetchMemberInfosData]);

	// Mise à jour de l'heure toutes les 10 secondes
	useEffect(() => {
		const interval = setInterval(() => {
			setHours(new Date().getHours());
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	// Synchronisation des états locaux avec les données du contexte
	useEffect(() => {
		setLoading(isLoading);
		setUserHabits(habits);
	}, [habits, isLoading]);

	// Fonction de rafraîchissement en arrière-plan
	const backgroundRefresh = useCallback(async () => {
		if (abortControllerHabits.current) {
			console.log("Abort previous fetch");
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		try {
			await getUserHabits({
				signal: abortControllerHabits.current.signal,
				forceRefresh: true,
			});
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) {
				handleError(error);
			}
		}
	}, [handleError]);

	// Rafraîchissement via action utilisateur
	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		if (abortControllerHabits.current) {
			abortControllerHabits.current.abort();
		}
		abortControllerHabits.current = new AbortController();
		try {
			await getUserHabits({
				signal: abortControllerHabits.current.signal,
				forceRefresh: true,
			});
		} catch (error) {
			if (!(error instanceof DOMException && error.name === "AbortError")) {
				handleError(error);
			}
		} finally {
			setRefreshing(false);
		}
	}, [handleError]);

	// Fonction utilitaire pour « show more »
	const updateShowMore = useCallback(
		(
			currentValue: number,
			listLength: number,
			setState: React.Dispatch<React.SetStateAction<number>>
		) => {
			if (currentValue < listLength) {
				setState((prev) => prev + 5);
			} else {
				setState(0);
			}
		},
		[]
	);

	// Fonctions de recherche mémorisées pour éviter des références instables
	const getHabitDetails = useCallback(
		(name: string) => habitsData.find((habit: Habit) => habit.name === name),
		[habitsData]
	);

	const getUserHabitDetails = useCallback(
		(habitId: string) =>
			userHabits.find((habit: UserHabit) => habit.id === habitId),
		[userHabits]
	);

	// Handlers pour l'animation au press in/out
	const handlePressIn = useCallback(() => {
		Animated.timing(rotation, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
	}, [rotation]);

	const handlePressOut = useCallback(() => {
		Animated.timing(rotation, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [rotation]);

	return {
		theme,
		navigation,
		userHabits,
		loading,
		refreshing,
		welcomeMessage,
		showMissingHabits,
		rotate,
		imageTemple,
		hours,
		isDayTime,
		isLoading,
		setWelcomeMessage,
		setShowMissingHabits,
		onRefresh,
		backgroundRefresh,
		handlePressIn,
		handlePressOut,
		getHabitDetails,
		getUserHabitDetails,
	};
};

export default useIndex;
