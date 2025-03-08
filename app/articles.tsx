import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	FlatList,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { Post } from "@type/post";
import { supabase } from "@utils/supabase";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";

export default function Articles() {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	const [posts, setPosts] = useState<Post[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [loading, setLoading] = useState<boolean>(false);
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
	const pageSize = 10;
	const flatListRef = useRef<FlatList>(null);

	const fetchArticles = async (page: number) => {
		setLoading(true);
		try {
			const from = (page - 1) * pageSize;
			const to = page * pageSize - 1;
			const { data, error } = await supabase
				.from("posts")
				.select()
				.order("date", { ascending: false })
				.range(from, to);

			if (error) {
				console.error("Error fetching posts:", error.message);
				return;
			}

			if (data) {
				setPosts((prevPosts) => {
					const existingSlugs = new Set(prevPosts.map((p) => p.slug));
					const uniqueData = data.filter((item) => !existingSlugs.has(item.slug));

					if (uniqueData.length < pageSize) {
						setHasMore(false);
					}

					return [...prevPosts, ...uniqueData];
				});
			}
		} catch (error: any) {
			console.error("Error fetching posts:", error.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchArticles(currentPage);
	}, []);

	const loadMore = () => {
		if (loading || !hasMore) return;
		const nextPage = currentPage + 1;
		setCurrentPage(nextPage);
		fetchArticles(nextPage);
	};

	const handleScroll = (event: any) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		setShowScrollTop(offsetY > 300);
	};

	const scrollToTop = () => {
		flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
	};

	// console.log("post 0", posts[0]);

	const renderItem = ({ item }: { item: Post }) => (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate("articleDetail", { article: item });
			}}
		>
			<View
				style={{
					marginVertical: 10,
					padding: 10,
				}}
			>
				{item.coverImage && (
					<Image
						source={{ uri: item.coverImage }}
						style={{ width: "100%", height: 200, borderRadius: 5 }}
					/>
				)}
				<Text
					style={{
						color: theme.colors.text,
						fontSize: 18,
						fontWeight: "bold",
						marginVertical: 5,
					}}
				>
					{item.title}
				</Text>
				<Text
					style={{ fontSize: 14, color: theme.colors.grayPrimary, marginBottom: 5 }}
				>
					{new Date(item.date).toLocaleDateString()}
				</Text>
				<Text
					numberOfLines={3}
					style={{ fontSize: 15, color: theme.colors.textTertiary }}
				>
					{item.excerpt}
				</Text>
			</View>
		</TouchableOpacity>
	);

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			<FlatList
				ref={flatListRef}
				data={posts}
				keyExtractor={(item) => item.slug}
				renderItem={renderItem}
				onEndReached={loadMore}
				onEndReachedThreshold={0.5}
				onScroll={handleScroll}
				scrollEventThrottle={16}
				ListHeaderComponent={
					<Text
						style={{ color: theme.colors.text }}
						className="text-2xl font-bold mt-3 mx-4"
					>
						Retrouvez tous nos articles
					</Text>
				}
				ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
			/>
			{showScrollTop && (
				<TouchableOpacity
					onPress={scrollToTop}
					style={{
						position: "absolute",
						right: 20,
						bottom: 30,
						backgroundColor: theme.colors.primary,
						padding: 10,
						borderRadius: 25,
						elevation: 5,
					}}
				>
					<Iconify icon="fluent:arrow-up-24-regular" color="#fff" size={25} />
				</TouchableOpacity>
			)}
		</View>
	);
}
