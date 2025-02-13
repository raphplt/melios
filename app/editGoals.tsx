import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { View, Text, ScrollView } from "react-native";
import { Answer, Questions } from "@constants/Slides";
import { Iconify } from "react-native-iconify";
import { useTheme } from "@context/ThemeContext";

export default function EditGoals() {
	const { member } = useData();
	const { theme } = useTheme();

	if (!member) return <LoaderScreen text="Chargement des objectifs" />;

	const title = "font-semibold text-lg py-1 px-3";
	const block = "py-3 px-3 rounded-xl my-2";

	const isChecked = (answer: Answer, memberAnswers: Answer[]) => {
		return memberAnswers.includes(answer);
	};

	const isSingleChecked = (answer: Answer, memberAnswer: string) => {
		return answer.answer === memberAnswer;
	};

	return (
		<ScrollView className="w-11/12 mx-auto">
			<View
				className={block}
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<Text
					className={title}
					style={{ fontFamily: "Baskerville", color: theme.colors.text }}
				>
					Aspects
				</Text>
				{Questions.find((q) => q.slug === "aspects")?.answers.map(
					(aspect, index) => (
						<View key={index} className="w-10/12 flex-row items-center py-1">
							{isChecked(aspect.answer, member.aspects) ? (
								<Iconify
									icon={"mdi:checkbox-marked"}
									size={24}
									color={theme.colors.primary}
								/>
							) : (
								<Iconify
									icon={"mdi:checkbox-blank-outline"}
									size={24}
									color={theme.colors.grayPrimary}
								/>
							)}
							<Text
								className="text-[16px] ml-1"
								style={{ color: theme.colors.textTertiary }}
							>
								{aspect.answer}
							</Text>
						</View>
					)
				)}
			</View>

			{/* Affichage des Objectifs */}
			<View
				className={block}
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<Text
					className={title}
					style={{ fontFamily: "Baskerville", color: theme.colors.text }}
				>
					Objectifs
				</Text>
				{Questions.find((q) => q.slug === "objectifs")?.answers.map(
					(objectif, index) => (
						<View key={index} className="w-10/12 flex-row items-center py-1">
							{isChecked(objectif.answer, member.objectifs) ? (
								<Iconify
									icon={"mdi:checkbox-marked"}
									size={24}
									color={theme.colors.primary}
								/>
							) : (
								<Iconify
									icon={"mdi:checkbox-blank-outline"}
									size={24}
									color={theme.colors.grayPrimary}
								/>
							)}
							<Text
								className="text-[16px] ml-1"
								style={{ color: theme.colors.textTertiary }}
							>
								{objectif.answer}
							</Text>
						</View>
					)
				)}
			</View>

			{/* Motivation */}
			<View
				className={block}
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<Text
					className={title}
					style={{ fontFamily: "Baskerville", color: theme.colors.text }}
				>
					Motivation
				</Text>
				{Questions.find((q) => q.slug === "motivation")?.answers.map(
					(motivation, index) => (
						<View key={index} className="w-10/12 flex-row items-center py-1">
							{isSingleChecked(motivation, member.motivation) ? (
								<Iconify
									icon={"mdi:radiobox-marked"}
									size={24}
									color={theme.colors.primary}
								/>
							) : (
								<Iconify
									icon={"mdi:radiobox-blank"}
									size={24}
									color={theme.colors.grayPrimary}
								/>
							)}
							<Text
								className="text-[16px] ml-1"
								style={{ color: theme.colors.textTertiary }}
							>
								{motivation.answer}
							</Text>
						</View>
					)
				)}
			</View>

			{/* Temps */}
			<View
				className={block}
				style={{
					backgroundColor: theme.colors.backgroundSecondary,
				}}
			>
				<Text
					className={title}
					style={{ fontFamily: "Baskerville", color: theme.colors.text }}
				>
					Temps
				</Text>
				{Questions.find((q) => q.slug === "temps")?.answers.map((temps, index) => (
					<View key={index} className="w-10/12 flex-row items-center py-1">
						{isSingleChecked(temps, member.temps) ? (
							<Iconify
								icon={"mdi:radiobox-marked"}
								size={24}
								color={theme.colors.primary}
							/>
						) : (
							<Iconify
								icon={"mdi:radiobox-blank"}
								size={24}
								color={theme.colors.grayPrimary}
							/>
						)}
						<Text
							className="text-[16px] ml-1"
							style={{ color: theme.colors.textTertiary }}
						>
							{temps.answer}
						</Text>
					</View>
				))}
			</View>
		</ScrollView>
	);
}