import React, { useState, useEffect } from "react";
import { Text, FlatList, View, RefreshControl, Pressable } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useData } from "@context/DataContext";
import { Iconify } from "react-native-iconify";
import Confidentiality from "@components/Modals/Confidentiality";
import ConfidentialityFilter from "./ConfidentialityFilter";
import { DailyLogExtended, getAllDailyLogsPaginated } from "@db/logs";
import { DailyLogItem } from "./DailyLogItem";
import PlaceHolderLog from "./PlaceHolderLog";

const AllLogs = () => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();

	const [dailyLogs, setDailyLogs] = useState<DailyLogExtended[]>([]);
	const [lastVisible, setLastVisible] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);
	const [confidentiality, setConfidentiality] = useState("public");
	const [refreshing, setRefreshing] = useState(false);

	const fetchDailyLogs = async (isRefreshing = false) => {
		if (loading || (!hasMore && !isRefreshing)) return;
		setLoading(true);

		try {
			if (isRefreshing) {
				setLastVisible(null);
				setDailyLogs([]);
			}

			const {
				dailyLogs: newDailyLogs,
				lastVisible: newLastVisible,
				hasMore: moreLogs,
			} = await getAllDailyLogsPaginated(
				10,
				isRefreshing ? null : lastVisible,
				confidentiality,
				member?.friends || []
			);

			setDailyLogs((prev) => [...(isRefreshing ? [] : prev), ...newDailyLogs]);
			setLastVisible(newLastVisible);
			setHasMore(moreLogs);
		} catch (error) {
			console.error("Erreur lors de la récupération des dailyLogs :", error);
		} finally {
			setLoading(false);
			if (isRefreshing) setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchDailyLogs(true);
	}, [confidentiality]);

	const renderItem = ({ item }: { item: DailyLogExtended }) => (
		<DailyLogItem item={item} />
	);

	return (
		<FlatList
			data={dailyLogs}
			renderItem={renderItem}
			keyExtractor={(item, index) =>
				`${item.logDocId}-${
					item.date && !isNaN(new Date(item.date).getTime())
						? item.date.toISOString()
						: "invalid-date"
				}-${index}`
			}
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
						[...Array(5)].map((_, index) => <PlaceHolderLog key={index} />)
					) : !hasMore ? (
						<Text
							className="text-center mt-4 mb-24"
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
							onPress={() => fetchDailyLogs(false)}
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
						fetchDailyLogs(true);
					}}
					colors={[theme.colors.primary]}
				/>
			}
		/>
	);
};

export default AllLogs;