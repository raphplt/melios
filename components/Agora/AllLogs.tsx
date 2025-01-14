import React, { useEffect, useState } from "react";
import {
	Text,
	FlatList,
	ActivityIndicator,
	View,
	TouchableOpacity,
} from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getAllUsersLogsPaginated } from "../../db/logs";
import { Member } from "@type/member";
import { Habit } from "@type/habit";
import { LogItem } from "./LogItem";
import Confidentiality from "@components/Modals/Confidentiality";
import { Iconify } from "react-native-iconify";
import { useData } from "@context/DataContext";

export type LogExtended = {
	id: string;
	habitId: string;
	member: Member | null;
	habit: Habit | null;
	logs: string[];
	uid: string;
	createAt: Date;
};

const AllLogs = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();
	const [logs, setLogs] = useState<LogExtended[] | null>([]);
	const [lastVisible, setLastVisible] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [confidentiality, setConfidentiality] = useState("public");

	const fetchLogs = async (isRefreshing = false) => {
		if (loading || (!hasMore && !isRefreshing)) return;
		setLoading(true);

		try {
			if (isRefreshing) {
				setLastVisible(null);
				setLogs([]);
			}

			const {
				logs: newLogs,
				lastVisible: newLastVisible,
				hasMore: moreLogs,
			} = await getAllUsersLogsPaginated(
				10,
				isRefreshing ? null : lastVisible,
				confidentiality,
				member?.friends
			);

			setLogs((prevLogs: any) => [...(isRefreshing ? [] : prevLogs), ...newLogs]);
			setLastVisible(newLastVisible);
			setHasMore(moreLogs);
		} catch (error) {
			console.error("Erreur lors de la récupération des logs :", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs(true);
	}, [confidentiality]);

	const renderItem = ({ item }: { item: LogExtended }) => (
		<LogItem item={item} />
	);

	return (
		<FlatList
			data={logs}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			onEndReached={() => fetchLogs(false)}
			className="w-[95%] mx-auto"
			onEndReachedThreshold={0.5}
			ListHeaderComponent={
				<View
					className="flex flex-row items-center justify-between px-4 py-4 my-3 rounded-lg"
					style={{
						backgroundColor: theme.colors.cardBackground,
					}}
				>
					<View className="flex flex-row items-center justify-start">
						<Iconify icon="tabler:activity" size={24} color={theme.colors.text} />
						<Text
							className="text-[15px] mx-3"
							style={{
								color: theme.colors.text,
								fontFamily: "BaskervilleBold",
							}}
						>
							{t("activity_users")}
						</Text>
					</View>

					<View
						className="flex flex-row items-center justify-start gap-2 rounded-2xl"
						style={{
							backgroundColor: theme.colors.background,
						}}
					>
						<TouchableOpacity
							onPress={() => setConfidentiality("public")}
							style={{
								backgroundColor:
									confidentiality === "public"
										? theme.colors.backgroundTertiary
										: theme.colors.background,
							}}
							className="px-3 py-1 rounded-2xl"
						>
							<Iconify
								icon="mynaui:globe"
								size={24}
								color={
									confidentiality === "public"
										? theme.colors.primary
										: theme.colors.textTertiary
								}
							/>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => setConfidentiality("friends")}
							style={{
								backgroundColor:
									confidentiality === "friends"
										? theme.colors.backgroundTertiary
										: theme.colors.background,
							}}
							className="px-3 py-1 rounded-2xl"
						>
							<Iconify
								icon="ion:people"
								size={24}
								color={
									confidentiality === "friends"
										? theme.colors.primary
										: theme.colors.textTertiary
								}
							/>
						</TouchableOpacity>
					</View>
					{/* Modale */}
					<Confidentiality />
				</View>
			}
			ListFooterComponent={
				loading ? (
					<ActivityIndicator
						size="large"
						color={theme.colors.primary}
						className="py-10"
					/>
				) : !hasMore ? (
					<Text
						className="text-center mt-4 mb-20"
						style={{ color: theme.colors.textTertiary }}
					>
						{" "}
					</Text>
				) : null
			}
			contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
		/>
	);
};

export default AllLogs;
