import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	ActivityIndicator,
	Pressable,
	TextInput,
} from "react-native";
import { getMembersPaginated } from "@db/member";
import { Member } from "@type/member";
import Friend from "@components/Agora/Friend";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const [members, setMembers] = useState<Member[]>([]);
	const { t } = useTranslation();
	const [loading, setLoading] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);
	const [filter, setFilter] = useState<"all" | "friends" | "received" | "sent">(
		"all"
	);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const fetchMembers = async (isRefreshing = false) => {
		try {
			if (isRefreshing) {
				setLastVisibleDoc(null);
				setMembers([]);
			}

			const { members: newMembers, lastVisible } = await getMembersPaginated(
				lastVisibleDoc,
				10,
				filter,
				member
			);

			if (newMembers && newMembers.length < 10) setHasMoreMembers(false);

			setMembers((prevMembers: any) => {
				const updatedMembers = isRefreshing
					? newMembers
					: [
							...prevMembers,
							...newMembers.filter(
								(newMember: any) =>
									!prevMembers.some((member: Member) => member.uid === newMember.uid)
							),
					  ];

				return updatedMembers;
			});

			setLastVisibleDoc(lastVisible);
			setLoading(false);
		} catch (error) {
			console.error("Erreur lors de la récupération des membres: ", error);
		}
	};

	useEffect(() => {
		fetchMembers(true);
	}, [filter]);

	const loadMoreMembers = () => {
		if (hasMoreMembers) fetchMembers();
	};

	const filteredMembers = members.filter((m) => {
		if (!member) return false;
		const isCurrentUser = m.uid === member.uid;
		const isFriend = member.friends?.includes(m.uid);
		const matchesFilter =
			(filter === "all" && !isFriend) ||
			(filter === "friends" && isFriend) ||
			(filter === "received" && member.friendRequestsReceived?.includes(m.uid)) ||
			(filter === "sent" && member.friendRequestsSent?.includes(m.uid));
		const matchesSearch = m.nom.toLowerCase().includes(searchQuery.toLowerCase());
		return !isCurrentUser && matchesFilter && matchesSearch;
	});

	if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

	const filterStyle = "px-4 py-2 rounded-lg mx-2";

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.colors.background,
			}}
		>
			<View className="flex flex-row items-center justify-center mb-4">
				<Pressable
					onPress={() => setFilter("all")}
					style={{
						backgroundColor:
							filter === "all" ? theme.colors.primary : theme.colors.cardBackground,
					}}
					className={filterStyle}
				>
					<Text
						style={{
							color: filter === "all" ? theme.colors.textSecondary : theme.colors.text,
						}}
					>
						{t("all")}
					</Text>
				</Pressable>
				<Pressable
					onPress={() => setFilter("friends")}
					style={{
						backgroundColor:
							filter === "friends"
								? theme.colors.primary
								: theme.colors.cardBackground,
					}}
					className={filterStyle}
				>
					<Text
						style={{
							color:
								filter === "friends" ? theme.colors.textSecondary : theme.colors.text,
						}}
						className="text-sm"
					>
						{t("friends")} ({member?.friends?.length || 0})
					</Text>
				</Pressable>
				<Pressable
					onPress={() => setFilter("received")}
					style={{
						backgroundColor:
							filter === "received"
								? theme.colors.primary
								: theme.colors.cardBackground,
					}}
					className={filterStyle}
				>
					<Text
						style={{
							color:
								filter === "received" ? theme.colors.textSecondary : theme.colors.text,
						}}
					>
						{t("received")} ({member?.friendRequestsReceived?.length || 0})
					</Text>
				</Pressable>
				<Pressable
					onPress={() => setFilter("sent")}
					style={{
						backgroundColor:
							filter === "sent" ? theme.colors.primary : theme.colors.cardBackground,
					}}
					className={filterStyle}
				>
					<Text
						style={{
							color:
								filter === "sent" ? theme.colors.textSecondary : theme.colors.text,
						}}
					>
						{t("sent")} ({member?.friendRequestsSent?.length || 0})
					</Text>
				</Pressable>
			</View>
			<View className="flex flex-row items-center justify-center mb-4 w-11/12 mx-auto">
				<TextInput
					placeholder={t("search_friend")}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={{
						borderRadius: 8,
						padding: 8,
						backgroundColor: theme.colors.cardBackground,
						width: "90%",
					}}
					className="mr-2"
				/>
				<Iconify icon="mdi:search" size={24} color={theme.colors.text} />
			</View>

			<FlatList
				data={filteredMembers}
				numColumns={2}
				keyExtractor={(item) => item.uid}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => <Friend member={item} />}
				onEndReached={loadMoreMembers}
				onEndReachedThreshold={0.5}
				className="w-[95%] mx-auto"
				ListFooterComponent={
					loading && hasMoreMembers ? (
						<ActivityIndicator size="large" color="#0000ff" />
					) : null
				}
				ListEmptyComponent={
					!loading ? (
						<Text style={{ textAlign: "center", marginTop: 20 }}>
							{t("no_results")}
						</Text>
					) : null
				}
			/>
		</View>
	);
};

export default FriendList;
