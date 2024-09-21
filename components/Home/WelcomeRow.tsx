import { useData } from "@context/DataContext";
import useIndex from "@hooks/useIndex";
import { useMemo } from "react";
import { Text, View } from "react-native";

export default function WelcomeRow() {
	const { hours, isDayTime } = useIndex();
	const { member } = useData();

	const message = useMemo(() => {
		if (hours >= 5 && hours < 13) {
			return "🌞 Bonjour";
		} else if (hours >= 13 && hours < 18) {
			return "☀️ Bon après-midi";
		} else {
			return "🌜 Bonsoir";
		}
	}, [hours]);

	const color = isDayTime ? "black" : "white";

	return (
		<View
			style={{ backgroundColor: "transparent" }}
			className="flex justify-between flex-row items-center  mx-auto"
		>
			<Text
				style={{
					color: color,

					fontFamily: "BaskervilleBold",
				}}
				className="text-[16px]"
			>
				{message + (member?.nom ? ", " + member.nom : "")}
			</Text>
		</View>
	);
}
