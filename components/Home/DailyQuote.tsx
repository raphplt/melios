import { fetchDailyQuote } from "@db/quote";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Quote } from "../../types/quote";
import { ThemeContext } from "@context/ThemeContext";

export default function DailyQuote() {
	const [quote, setQuote] = useState<Quote | null>(null);
	const { theme } = useContext(ThemeContext);

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
			<View className="my-4 mx-5">
				<Text
					className="text-[16px] leading-6"
					style={{
						color: theme.colors.text,
						fontFamily: "Baskerville",
					}}
				>
					{quote ? quote.text : "Loading..."}
				</Text>
				<Text style={{ color: theme.colors.text }} className="mt-2">
					- {quote ? quote.author : "Loading..."}
				</Text>
			</View>
		</View>
	);
}
