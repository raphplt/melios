import { fetchDailyQuote } from "@db/quote";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Quote } from "@type/quote";
import { useData } from "@context/DataContext";

export default function DailyQuote() {
	const [quote, setQuote] = useState<Quote | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();

	useEffect(() => {
		const getQuote = async () => {
			try {
				if (!member) return;
				setIsLoading(true);

				const dailyQuote = await fetchDailyQuote();
				setQuote(dailyQuote);
			} catch (error) {
				console.error("Error fetching daily quote: ", error);
			} finally {
				setIsLoading(false);
			}
		};

		getQuote();
	}, [member]);

	if (!member) return null;

	return (
		<View
			className="w-[95%] mx-auto flex flex-col items-start justify-start rounded-lg mt-2 mb-8"
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
					"{isLoading ? t("loading") : quote?.text}"
				</Text>
				<Text style={{ color: theme.colors.text }} className="mt-2">
					- {isLoading ? t("loading") : quote?.author}
				</Text>
			</View>
		</View>
	);
}