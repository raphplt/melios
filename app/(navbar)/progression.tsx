import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import { Text, View } from "../../components/Themed";
import { getMemberHabits } from "../../db/member";
import { ScrollView } from "react-native-gesture-handler";

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
			<Text
				className="text-center mb-4 text-lg mt-3"
				style={{ color: theme.colors.text }}
			>
				{userHabits && userHabits.length} habitudes
			</Text>
			<View />
			{/* <EditScreenInfo path="app/(tabs)/two.tsx" /> */}
			<ScrollView className="flex flex-col gap-5">
				{userHabits &&
					userHabits.map((habit: any) => {
						return (
							<Text key={habit.id} style={{ color: theme.colors.text }}>
								{habit.name}
							</Text>
						);
					})}
			</ScrollView>
		</View>
	);
}
