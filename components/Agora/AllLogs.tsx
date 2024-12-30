import React, { useEffect, useState } from "react";
import { Text, FlatList, ActivityIndicator, View } from "react-native";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { getAllUsersLogsPaginated } from "../../db/logs";
import { Member } from "@type/member";
import { Habit } from "@type/habit";
import { LogItem } from "./LogItem";
import Confidentiality from "@components/Modals/Confidentiality";
import { Iconify } from "react-native-iconify";

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
	const [logs, setLogs] = useState<LogExtended[] | null>([]);
	const [lastVisible, setLastVisible] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	const fetchLogs = async () => {
		if (loading || !hasMore) return;
		setLoading(true);

		try {
			const {
				logs: newLogs,
				lastVisible: newLastVisible,
				hasMore: moreLogs,
			} = await getAllUsersLogsPaginated(10, lastVisible);

			setLogs((prevLogs: any) => [...prevLogs, ...newLogs]);
			setLastVisible(newLastVisible);
			setHasMore(moreLogs);
		} catch (error) {
			console.error("Erreur lors de la récupération des logs :", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const renderItem = ({ item }: { item: LogExtended }) => (
		<LogItem item={item} />
	);

	return (
		<FlatList
			data={logs}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			onEndReached={fetchLogs}
			className="w-[94%] mx-auto"
			onEndReachedThreshold={0.5}
			ListHeaderComponent={
				<View
					className="flex flex-row items-center justify-start px-3 py-3 my-3 mb-3 rounded-lg"
					style={{
						borderColor: theme.colors.border,
						borderWidth: 2,
					}}
				>
					<Iconify icon="mdi:account-group" size={24} color={theme.colors.text} />
					<Text
						className="text-[16px] mx-3"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{t("activity_users")}
					</Text>

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
