import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { View, Text, ScrollView } from "react-native";

export default function EditGoals() {
	const { member } = useData();

	if (!member) return <LoaderScreen text="Chargement des objectifs" />;

	const title = "font-semibold text-lg w-11/12 mx-auto py-1";

	return (
		<ScrollView>
			<View>
				<Text
					className={title}
					style={{
						fontFamily: "Baskerville",
					}}
				>
					Aspects
				</Text>
				{member.aspects.map((aspect, index) => (
					<View key={index} className="w-10/12">
						<Text>Answer: {aspect.answer}</Text>
						<Text>Value: {aspect.value}</Text>
					</View>
				))}
			</View>
			<View>
				<Text>Motivation:</Text>
				<Text>Answer: {member.motivation.answer}</Text>
				<Text>Value: {member.motivation.value}</Text>
			</View>
			<View>
				<Text>Objectifs:</Text>
				{member.objectifs.map((objectif, index) => (
					<View key={index}>
						<Text>Answer: {objectif.answer}</Text>
						<Text>Value: {objectif.value}</Text>
					</View>
				))}
			</View>
			<View>
				<Text>Temps:</Text>
				<Text>Answer: {member.temps.answer}</Text>
				<Text>Value: {member.temps.value}</Text>
			</View>
		</ScrollView>
	);
}
