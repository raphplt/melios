import ArticleCard from "@components/Agora/ArticleCard";
import { themes } from "@constants/feed";
import { useTheme } from "@context/ThemeContext";
import { useRssFeed } from "@hooks/useRssFeed";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	Pressable,
	Animated,
	ScrollView,
	Platform,
	StatusBar,
	ActivityIndicator,
} from "react-native";
import { Iconify } from "react-native-iconify";

const HomeFeed = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const [selectedTheme, setSelectedTheme] = useState<string>("sport");
	const [showFilters, setShowFilters] = useState<boolean>(false);
	const { items, loading } = useRssFeed(themes[selectedTheme].urls[0]);

	const filterHeight = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		const maxHeight = Math.min(Object.keys(themes).length * 50, 200);
		Animated.timing(filterHeight, {
			toValue: showFilters ? maxHeight : 0,
			duration: 300,
			useNativeDriver: false,
		}).start();
	}, [showFilters]);

	return (
		<View className="flex flex-col w-full">
			{/* Gradient d'arrière-plan */}
			<LinearGradient
				colors={[theme.colors.backgroundTertiary, theme.colors.background]}
				style={{
					paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 40,
				}}
				className="absolute top-0 left-0 right-0 h-full w-full"
			></LinearGradient>

			{/* Barre de filtre */}
			<View className="flex flex-row items-center justify-between mx-4 mt-4 mb-2">
				<Text
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
					className="text-xl pb-2"
				>
					{t("filter")}
				</Text>
				<Pressable onPress={() => setShowFilters(!showFilters)}>
					{showFilters ? (
						<Iconify icon="mdi:filter-off" size={24} color={theme.colors.primary} />
					) : (
						<Iconify
							icon="material-symbols:filter-alt"
							size={24}
							color={theme.colors.primary}
						/>
					)}
				</Pressable>
			</View>

			{/* Filtres animés */}
			<Animated.View style={{ height: filterHeight, overflow: "hidden" }}>
				<ScrollView>
					<View className="flex flex-row items-center justify-start flex-wrap h-full">
						{Object.keys(themes).map((slug) => (
							<TouchableOpacity
								key={slug}
								className="p-2 mx-2 my-1 rounded-2xl"
								style={{
									backgroundColor:
										selectedTheme === slug
											? theme.colors.primary
											: theme.colors.cardBackground,
								}}
								onPress={() => setSelectedTheme(slug)}
							>
								<Text
									style={{
										color:
											selectedTheme === slug
												? theme.colors.textSecondary
												: theme.colors.primary,
									}}
								>
									{themes[slug].name}
								</Text>
							</TouchableOpacity>
						))}
					</View>
				</ScrollView>
			</Animated.View>

			{/* Contenu principal */}
			{loading ? (
				<>
					<ActivityIndicator size="large" color={theme.colors.primary} />
					<Text
						className="text-center text-xl font-bold"
						style={{ color: theme.colors.text }}
					>
						{t("loading")}
					</Text>
				</>
			) : (
				<FlatList
					data={items}
					keyExtractor={(item, index) => index.toString()}
					className="bg-transparent"
					showsVerticalScrollIndicator={false}
					renderItem={({ item }) => (
						<ArticleCard
							title={item.title}
							description={item.description}
							link={item.link}
						/>
					)}
				/>
			)}
		</View>
	);
};

export default HomeFeed;
