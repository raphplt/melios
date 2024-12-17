import { fetchDailyQuote } from "@db/quote";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Quote } from "@type/quote";

export default function DailyQuote() {
	const [quote, setQuote] = useState<Quote | null>(null);
	const { theme } = useTheme();
	const { t } = useTranslation();

	useEffect(() => {
		const getQuote = async () => {
			try {
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
			className="w-11/12 mx-auto flex flex-col items-center justify-center rounded-xl mt-3 mb-8"
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
