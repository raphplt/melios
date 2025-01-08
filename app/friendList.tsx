import React, { useState, useEffect } from "react";
import {
	Text,
	View,
	FlatList,
	ActivityIndicator,
	Pressable,
} from "react-native";
import { getMembersPaginated } from "@db/member";
import { Member } from "@type/member";
import Friend from "@components/Agora/Friend";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);
	const [filter, setFilter] = useState<"all" | "friends" | "received" | "sent">(
		"all"
	);

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
		if (filter === "friends") {
			return member.friends?.includes(m.uid);
		} else if (filter === "received") {
			return member.friendRequestsReceived?.includes(m.uid);
		} else if (filter === "sent") {
			return member.friendRequestsSent?.includes(m.uid);
		} else if (filter === "all") {
			return (
				!member.friends?.includes(m.uid) &&
				!member.friendRequestsReceived?.includes(m.uid) &&
				!member.friendRequestsSent?.includes(m.uid)
			);
		} else {
			return true;
		}
	});

	if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

	const filterStyle = "px-4 py-2 rounded-lg mx-2";

	return (
		<View>
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
						Tous
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
						Amis ({member?.friends?.length || 0})
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
						Reçues ({member?.friendRequestsReceived?.length || 0})
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
						Envoyées ({member?.friendRequestsSent?.length || 0})
					</Text>
				</Pressable>
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
					hasMoreMembers ? <ActivityIndicator size="large" color="#0000ff" /> : null
				}
			/>
		</View>
	);
};

export default FriendList;
