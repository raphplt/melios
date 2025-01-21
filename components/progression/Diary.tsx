import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
import SectionHeader from "./SectionHeader";
import { useTranslation } from "react-i18next";
import { getDiaryEntries } from "../../db/diary";

export default function Diary() {
	const { t } = useTranslation();
	const [showDiary, setShowDiary] = useState(true);
	const [diaryEntries, setDiaryEntries] = useState<Diary[]>([]);

	useEffect(() => {
		const fetchDiaryEntries = async () => {
			try {
				const entries = await getDiaryEntries();
				setDiaryEntries(entries as any);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des entrées du journal :",
					error
				);
			}
		};

		fetchDiaryEntries();
	}, []);

	return (
		<SectionHeader
			title={t("diary")}
			show={showDiary}
			setShow={setShowDiary}
			icon="diary"
		>
			{diaryEntries.length > 0 ? (
				diaryEntries.map((entry) => (
					<View key={entry.id}>
						<Text>{entry.content}</Text>
					</View>
				))
			) : (
				<Text>{t("noDiaryEntries")}</Text>
			)}
		</SectionHeader>
	);
}
