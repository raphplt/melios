import React, { useEffect, useState } from "react";
import {
	Text,
	FlatList,
	ActivityIndicator,
	View,
	Button,
	RefreshControl,
	Pressable,
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
import ConfidentialityFilter from "./ConfidentialityFilter";

export type LogExtended = {
	id: string;
	habitId: string;
	member: Member | null;
	habit: Habit | null;
	logs: string[];
	uid: string;
	createAt: Date;
	reactions?: any[];
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
	const [refreshing, setRefreshing] = useState(false); // État pour le rafraîchissement

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

			setLogs((prevLogs: any) => {
				const updatedLogs = [...(isRefreshing ? [] : prevLogs), ...newLogs];
				const uniqueLogs = Array.from(
					new Set(updatedLogs.map((log) => log.id))
				).map((id) => updatedLogs.find((log) => log.id === id));
				return uniqueLogs;
			});

			setLastVisible(newLastVisible);
			setHasMore(newLogs.length > 0 && moreLogs);
		} catch (error) {
			console.error("Erreur lors de la récupération des logs :", error);
		} finally {
			setLoading(false);
			if (isRefreshing) setRefreshing(false);
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
			className="w-[95%] mx-auto"
			ListHeaderComponent={
				<View
					className="flex flex-row items-center justify-between px-6 py-3 my-4 rounded-xl"
					style={{
						backgroundColor: theme.colors.backgroundTertiary,

						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.1,
						shadowRadius: 4,
					}}
				>
					<View className="flex flex-row items-center justify-start">
						<Iconify icon="mdi:column" size={22} color={theme.colors.primary} />
						<Text
							className="text-[15px] font-semibold mx-3"
							style={{
								color: theme.colors.primary,
							}}
						>
							{t("activity_users")}
						</Text>
					</View>

					<View className="flex flex-row items-center space-x-4">
						<ConfidentialityFilter
							confidentiality={confidentiality}
							setConfidentiality={setConfidentiality}
						/>
						<Confidentiality />
					</View>
				</View>
			}
			ListFooterComponent={
				<View>
					{loading ? (
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
							{t("no_more_logs")}
						</Text>
					) : (
						<Pressable
							className="mt-2 mb-24 p-4 rounded-xl"
							style={{
								backgroundColor: theme.colors.primary,
							}}
							onPress={() => fetchLogs(false)}
						>
							<Text
								className="text-center"
								style={{ color: theme.colors.textSecondary }}
							>
								{t("load_more")}
							</Text>
						</Pressable>
					)}
				</View>
			}
			contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={() => {
						setRefreshing(true);
						fetchLogs(true);
					}}
					colors={[theme.colors.primary]}
				/>
			}
		/>
	);
};

export default AllLogs;