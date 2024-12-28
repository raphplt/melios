import { useTheme } from "@context/ThemeContext";
import React, { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { getAllUsersLogsPaginated } from "../../db/logs";
import { Member } from "@type/member";
import { Habit } from "@type/habit";
import { useTranslation } from "react-i18next";
import { FontAwesome6 } from "@expo/vector-icons";

export type Log = {
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
	const [logs, setLogs] = useState<Log[] | null>([]);
	const [lastVisible, setLastVisible] = useState(null);
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

	const renderItem = ({ item }: { item: Log }) => {
		const mostRecentDate: Date | undefined = item.logs
			.map((logDate: string) => new Date(logDate))
			.sort((a: Date, b: Date) => b.getTime() - a.getTime())[0];

		return (
			<View
				className="mb-4 p-3 rounded-lg"
				style={{
					backgroundColor: theme.colors.background,
					borderWidth: 1,
					borderColor: theme.colors.border,
				}}
			>
				<View className="flex flex-row items-center mb-2">
					<Text className="text-lg font-bold" style={{ color: theme.colors.text }}>
						{item.member?.nom || "Nom inconnu"}{" "}
					</Text>
					<Text className=" " style={{ color: theme.colors.textTertiary }}>
						{t("has_done_habit")}
					</Text>
				</View>
				<View className="flex flex-row justify-center items-center my-2">
					<FontAwesome6
						name={item.habit?.icon || "question"}
						size={24}
						color={item.habit?.color || theme.colors.text}
					/>
				</View>
				<Text
					className=" font-semibold text-xl mb-2 text-center"
					style={{ color: theme.colors.text }}
				>
					{item.habit?.name || item.habitId}
				</Text>
				{mostRecentDate && (
					<Text className="text-sm" style={{ color: theme.colors.text }}>
						{t("the")} {mostRecentDate.toLocaleDateString("fr-FR")}
					</Text>
				)}
			</View>
		);
	};

	return (
		<FlatList
			data={logs}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
			onEndReached={fetchLogs}
			onEndReachedThreshold={0.5}
			ListHeaderComponent={
				<Text
					className="text-lg mt-2 mb-4"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{t("activity_users")}
				</Text>
			}
			ListFooterComponent={
				loading ? (
					<ActivityIndicator size="large" color={theme.colors.primary} />
				) : !hasMore ? (
					<Text
						className="text-center mt-4"
						style={{ color: theme.colors.textTertiary }}
					>
						{t("all_logs_are_displayed")}
					</Text>
				) : null
			}
			contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
		/>
	);
};

export default AllLogs;
