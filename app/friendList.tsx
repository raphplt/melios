import React, { useState, useEffect, useRef } from "react";
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
import Filters from "@components/Agora/Filters";

export type FriendFilter = "all" | "friends" | "received" | "sent";

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(false);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);
	const [filter, setFilter] = useState<FriendFilter>("all");
	const [searchQuery, setSearchQuery] = useState<string>("");

	const cacheRef = useRef<
		Record<string, { members: Member[]; lastVisible: any }>
	>({});

	const fetchMembers = async (isRefreshing = false) => {
		if (loading) return;
		try {
			if (isRefreshing) {
				setLastVisibleDoc(null);
				setMembers([]);
				setHasMoreMembers(true);
			}
			setLoading(true);

			const cacheKey = `${filter}-${lastVisibleDoc ? lastVisibleDoc.id : "first"}`;

			if (cacheRef.current[cacheKey]) {
				const { members: cachedMembers, lastVisible } = cacheRef.current[cacheKey];
				setMembers((prevMembers) =>
					isRefreshing ? cachedMembers : [...prevMembers, ...cachedMembers]
				);
				setLastVisibleDoc(lastVisible);
				if (cachedMembers.length < 10) setHasMoreMembers(false);
				setLoading(false);
				return;
			}

			const { members: newMembers, lastVisible } = await getMembersPaginated(
				lastVisibleDoc,
				10,
				filter,
				member
			);

			if (newMembers && newMembers.length < 10) setHasMoreMembers(false);

			setMembers((prevMembers: any) =>
				isRefreshing ? newMembers : [...prevMembers, ...newMembers]
			);
			setLastVisibleDoc(lastVisible);

			cacheRef.current[cacheKey] = { members: newMembers, lastVisible } as any;

			setLoading(false);
		} catch (error) {
			console.log("Erreur lors de la récupération des membres: ", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMembers(true);
	}, [filter]);

	const loadMoreMembers = () => {
		if (hasMoreMembers && !loading) {
			fetchMembers();
		}
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

	if (loading && members.length === 0) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			{/* Boutons de filtre */}
			<Filters filter={filter} setFilter={setFilter} member={member} />

			{/* Zone de recherche */}
			<View
				style={{
					backgroundColor: theme.colors.cardBackground,
					borderColor: theme.colors.textTertiary,
					borderWidth: 1,
					borderRadius: 16,
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					paddingHorizontal: 16,
					paddingVertical: 10,
					marginBottom: 16,
					alignSelf: "center",
					width: "95%",
				}}
			>
				<TextInput
					placeholder={t("search_friend")}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={{ flex: 1 }}
				/>
				<Iconify icon="mdi:search" size={24} color={theme.colors.textTertiary} />
			</View>

			{/* Liste des membres */}
			<FlatList
				data={filteredMembers}
				numColumns={2}
				keyExtractor={(item) => item.uid}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => <Friend member={item} />}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={
					!loading ? (
						<Text style={{ textAlign: "center", marginTop: 20 }}>
							{t("no_results")}
						</Text>
					) : null
				}
				// Affichage du bouton "Voir plus" en bas de la liste
				ListFooterComponent={
					<View style={{ alignItems: "center", marginVertical: 16 }}>
						{hasMoreMembers && !loading ? (
							<Pressable
								onPress={loadMoreMembers}
								style={{
									backgroundColor: theme.colors.backgroundTertiary,
								}}
								className="rounded-xl p-4 w-[95%] flex items-center justify-center"
							>
								<Text
									style={{ color: theme.colors.primary }}
									className="text-lg font-semibold"
								>
									{t("see_more")}
								</Text>
							</Pressable>
						) : loading ? (
							<ActivityIndicator
								size="large"
								color="#0000ff"
								style={{ marginVertical: 16 }}
							/>
						) : null}
					</View>
				}
				style={{ width: "95%", alignSelf: "center" }}
			/>
		</View>
	);
};

export default FriendList;
