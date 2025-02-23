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

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [members, setMembers] = useState<Member[]>([]);
	const [loading, setLoading] = useState(true);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);
	const [filter, setFilter] = useState<"all" | "friends" | "received" | "sent">(
		"all"
	);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const cacheRef = useRef<
		Record<string, { members: Member[]; lastVisible: any }>
	>({});

	const fetchMembers = async (isRefreshing = false) => {
		try {
			// Si rafraîchissement, on réinitialise
			if (isRefreshing) {
				setLastVisibleDoc(null);
				setMembers([]);
				setHasMoreMembers(true);
			}
			setLoading(true);

			// Clé du cache basée sur le filtre et la page
			const cacheKey = `${filter}-${lastVisibleDoc ? lastVisibleDoc.id : "first"}`;

			if (cacheRef.current[cacheKey]) {
				// Utilisation des données en cache
				const { members: cachedMembers, lastVisible } = cacheRef.current[cacheKey];
				setMembers((prevMembers) =>
					isRefreshing ? cachedMembers : [...prevMembers, ...cachedMembers]
				);
				setLastVisibleDoc(lastVisible);
				if (cachedMembers.length < 10) setHasMoreMembers(false);
				setLoading(false);
				return;
			}

			// Récupération des membres via l'API
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

			// Mise en cache de la page
			cacheRef.current[cacheKey] = { members: newMembers as any, lastVisible };

			setLoading(false);
		} catch (error) {
			console.log("Erreur lors de la récupération des membres: ", error);
			setLoading(false);
		}
	};

	// Recharge lors du changement de filtre
	useEffect(() => {
		fetchMembers(true);
	}, [filter]);

	const loadMoreMembers = () => {
		if (hasMoreMembers && !loading) {
			fetchMembers();
		}
	};

	// Filtrage côté client pour la recherche et le filtre
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

	// Style commun pour les boutons de filtre
	const filterStyle = {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		marginHorizontal: 8,
	};

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			{/* Boutons de filtre */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
				}}
			>
				<Pressable
					onPress={() => setFilter("all")}
					style={{
						backgroundColor:
							filter === "all" ? theme.colors.primary : theme.colors.cardBackground,
						...filterStyle,
					}}
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
						...filterStyle,
					}}
				>
					<Text
						style={{
							color:
								filter === "friends" ? theme.colors.textSecondary : theme.colors.text,
							fontSize: 14,
						}}
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
						...filterStyle,
					}}
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
						...filterStyle,
					}}
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

			{/* Zone de recherche */}
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					marginBottom: 16,
					width: "90%",
					alignSelf: "center",
				}}
			>
				<TextInput
					placeholder={t("search_friend")}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={{
						flex: 1,
						borderRadius: 8,
						padding: 8,
						backgroundColor: theme.colors.cardBackground,
					}}
				/>
				<Iconify icon="mdi:search" size={24} color={theme.colors.text} />
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
				ListFooterComponent={
					hasMoreMembers && !loading ? (
						<Pressable
							onPress={loadMoreMembers}
							style={{
								alignSelf: "center",
								marginVertical: 16,
								padding: 10,
								backgroundColor: theme.colors.backgroundTertiary,
							}}
							className="w-11/12 rounded-full flex items-center justify-center py-4"
						>
							<Text style={{ color: theme.colors.text }}>{t("see_more")}</Text>
						</Pressable>
					) : loading ? (
						<ActivityIndicator
							size="large"
							color="#0000ff"
							style={{ marginVertical: 16 }}
						/>
					) : null
				}
				style={{ width: "95%", alignSelf: "center" }}
			/>
		</View>
	);
};

export default FriendList;
