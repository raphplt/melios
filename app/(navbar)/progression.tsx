import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";

export default function Progression() {
	const { theme } = useContext(ThemeContext);
	const isMounted = useRef(true);
	const [userHabits, setUserHabits] = useState<any>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberHabits();
				if (isMounted.current) {
					setUserHabits(data);
					setLoading(false);
				}
			} catch (error) {
				handleError(error);
				setUserHabits([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				className="text-center mb-4 text-xl mt-3"
				style={{ color: theme.colors.text }}
			>
				Voir ma progression
			</Text>
			<View />
			{/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
			<Text style={{ color: theme.colors.text }} className="text-lg mt-8">
				{JSON.stringify(userHabits)}
			</Text>
		</View>
	);
}
