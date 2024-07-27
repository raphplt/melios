import { useEffect, useRef, useState } from "react";
import { getMemberHabits } from "../db/member";

export const useHabits = () => {
	const isMounted = useRef(true);
	const [habits, setHabits] = useState([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setHabits(data);
					setLoading(false);
				}
			} catch (error) {
				console.log("Erreur lors de la récupération des habitudes : ", error);
				setHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		try {
			const data = await getMemberHabits();
			setHabits(data);
			setLoading(false);
		} catch (error) {
			setHabits([]);
			console.log("Erreur lors de la récupération des habitudes : ", error);
		} finally {
			setRefreshing(false);
		}
	};

	return { habits, loading, refreshing, onRefresh };
};
