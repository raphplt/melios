import { ThemeContext } from "@context/ThemeContext";
import React, { useState, useRef, useContext } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Animated,
	StyleSheet,
} from "react-native";

const FAQItem = ({
	question,
	answer,
}: {
	question: string;
	answer: string;
}) => {
	const { theme } = useContext(ThemeContext);
	const [expanded, setExpanded] = useState(false);
	const animation = useRef(new Animated.Value(0)).current;

	const toggleExpansion = () => {
		const initialValue = expanded ? 1 : 0;
		const finalValue = expanded ? 0 : 1;

		setExpanded(!expanded);

		animation.setValue(initialValue);
		Animated.timing(animation, {
			toValue: finalValue,
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const height = animation.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 100], // Adjust this value based on the content height
	});

	return (
		<View>
			<TouchableOpacity onPress={toggleExpansion}>
				<View className="py-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="text-lg font-semibold"
					>
						{question}
					</Text>
				</View>
			</TouchableOpacity>
			<Animated.View style={{ height, overflow: "hidden" }}>
				<Text
					style={{
						color: theme.colors.textTertiary,
					}}
					className="text-[15px]"
				>
					{answer}
				</Text>
			</Animated.View>
		</View>
	);
};

export default function Help() {
	return (
		<View style={styles.container}>
			<FAQItem
				question="Qu'est ce que Melios ?"
				answer="Melios est une application qui vous aide à suivre vos habitudes et à gagner des récompenses."
			/>
			<FAQItem
				question="Comment Melios peut m'aider ?"
				answer="Melios vous encourage à développer des bonnes habitudes. Avec celles-ci, vous pouvez améliorez votre quotidien en rendant ces comportements automatiques et plus faciles à maintenir à long terme."
			/>
			<FAQItem
				question="Comment ça fonctionne ?"
				answer="Vous sélectionnez des habitudes à suivre quotidiennement et vous gagnez des points en les complétant. Vous pouvez ensuite échanger ces points contre des récompenses."
			/>
			<FAQItem
				question="Comment ajouter une habitude ?"
				answer="Pour ajouter une habitude, vous pouvez cliquer sur le bouton + sur la page d'accueil, puis sélectionner l'habitude que vous souhaitez ajouter."
			/>

			<FAQItem
				question="A quoi correspondent les points ?"
				answer="Les points correspondent à vos progrès dans l'application et peuvent être utilisés pour débloquer des récompenses."
			/>
			<FAQItem
				question="Comment débloquer des récompenses ?"
				answer="Vous pouvez débloquer des récompenses en accumulant des points et en les échangeant dans la section des récompenses."
			/>
			<FAQItem
				question="Comment supprimer mon compte ?"
				answer="Pour supprimer votre compte, vous pouvez aller sur la page Mon compte, puis cliquer sur le bouton Éditer le profil. En bas de la page, vous trouverez un bouton pour supprimer votre compte."
			/>
			<FAQItem
				question="Comment contacter le support ?"
				answer="Pour contacter le support, vous pouvez envoyer un email à l'adresse suivante : melios.customer@gmail.com
				"
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
	},
	questionContainer: {
		paddingVertical: 10,
	},
	questionText: {
		fontSize: 18,
		fontWeight: "bold",
	},
	answerText: {
		fontSize: 16,
		paddingVertical: 10,
	},
});
