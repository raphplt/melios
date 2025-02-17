import { fetchDailyQuote } from "@db/quote";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Quote } from "@type/quote";
import { useData } from "@context/DataContext";

export default function DailyQuote() {
	const [quote, setQuote] = useState<Quote | null>(null);
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();

	useEffect(() => {
		const getQuote = async () => {
			try {
				if (!member) return;
				const dailyQuote = await fetchDailyQuote();
				setQuote(dailyQuote);
			} catch (error) {
				console.error("Error fetching daily quote: ", error);
			}
		};

		getQuote();
	}, []);

	return (
		<View
			className="w-[95%] mx-auto flex flex-col items-center justify-center rounded-lg mt-2 mb-8"
			style={{
				backgroundColor: theme.colors.blueSecondary,
			}}
		>
			<View className="my-4 mx-4">
				<Text
					className="text-lg leading-6"
					style={{
						color: theme.colors.text,
						fontFamily: "Baskerville",
					}}
				>
					"{quote ? quote.text : t("loading")}"
				</Text>
				<Text style={{ color: theme.colors.text }} className="mt-2">
					- {quote ? quote.author : t("loading")}
				</Text>
			</View>
		</View>
	);
}
