import React, { useState, useEffect, useRef } from "react";
import {
	Text,
	View,
	FlatList,
	ActivityIndicator,
	Pressable,
	TextInput,
	StyleSheet,
} from "react-native";
import { getMembersPaginated } from "@db/member";
import { Member } from "@type/member";
import Friend from "@components/Agora/Friend";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { useTranslation } from "react-i18next";
import { Iconify } from "react-native-iconify";
import Filters from "@components/Agora/Filters";
import { AddFriendModal } from "@components/Modals/AddFriendModal";

// Hook de debounce pour éviter trop d'appels API
const useDebounce = (value: string, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);
		return () => clearTimeout(handler);
	}, [value, delay]);
	return debouncedValue;
};

// Pour la liste principale, nous ne gardons que ces filtres
export type FriendFilter = "friends" | "received" | "sent";

const FriendList = () => {
	const { member } = useData();
	const { theme } = useTheme();
	const { t } = useTranslation();

	const [members, setMembers] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [lastVisibleDoc, setLastVisibleDoc] = useState<any>(null);
	const [hasMoreMembers, setHasMoreMembers] = useState(true);
	// Par défaut, on affiche uniquement les amis (pas "all")
	const [filter, setFilter] = useState<FriendFilter>("friends");
	const [searchQuery, setSearchQuery] = useState<string>("");
	const debouncedSearchQuery = useDebounce(searchQuery, 300);
	const [showAddFriendModal, setShowAddFriendModal] = useState(false);

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

			// Clé de cache intégrant le filtre et la recherche
			const cacheKey = `${filter}-${debouncedSearchQuery}-${
				lastVisibleDoc ? lastVisibleDoc.id : "first"
			}`;
			if (cacheRef.current[cacheKey]) {
				const { members: cachedMembers, lastVisible } = cacheRef.current[cacheKey];
				setMembers(isRefreshing ? cachedMembers : [...members, ...cachedMembers]);
				setLastVisibleDoc(lastVisible);
				if (cachedMembers.length < 10) setHasMoreMembers(false);
				setLoading(false);
				return;
			}

			const { members: newMembers, lastVisible } = await getMembersPaginated(
				lastVisibleDoc,
				10,
				filter,
				member,
				debouncedSearchQuery
			);
			if (newMembers && newMembers.length < 10) setHasMoreMembers(false);
			setMembers(isRefreshing ? newMembers : [...members, ...newMembers]);
			setLastVisibleDoc(lastVisible);
			cacheRef.current[cacheKey] = { members: newMembers, lastVisible };
			setLoading(false);
		} catch (error) {
			console.log("Erreur lors de la récupération des membres: ", error);
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchMembers(true);
	}, [filter, debouncedSearchQuery]);

	const loadMoreMembers = () => {
		if (hasMoreMembers && !loading) {
			fetchMembers();
		}
	};

	// On exclut le profil courant
	const filteredMembers = members.filter((m) =>
		member ? m.uid !== member.uid : false
	);

	if (loading && members.length === 0) {
		return (
			<View style={{ paddingVertical: 20 }}>
				<ActivityIndicator size="large" color={theme.colors.primary} />
			</View>
		);
	}

	return (
		<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
			{/* Boutons de filtres : amis, demandes reçues et envoyées */}
			<Filters filter={filter} setFilter={setFilter} member={member} />

			{/* Bouton dédié pour ajouter un ami */}
			<Pressable
				onPress={() => setShowAddFriendModal(true)}
				style={[styles.addFriendButton, { backgroundColor: theme.colors.primary }]}
			>
				<Iconify
					icon="mdi:account-plus"
					size={20}
					color={theme.colors.textSecondary}
				/>
				<Text
					style={{
						color: theme.colors.textSecondary,
						fontWeight: "bold",
						marginLeft: 8,
					}}
				>
					{t("add_friend")}
				</Text>
			</Pressable>

			{/* Zone de recherche pour affiner le filtre de la liste principale */}
			{/* <View
				style={[
					styles.searchContainer,
					{
						backgroundColor: theme.colors.cardBackground,
						borderColor: theme.colors.textTertiary,
					},
				]}
			>
				<Iconify icon="mdi:search" size={24} color={theme.colors.textTertiary} />
				<TextInput
					placeholder={t("search_friend")}
					value={searchQuery}
					onChangeText={setSearchQuery}
					style={{ flex: 1 }}
					placeholderTextColor={theme.colors.textTertiary}
				/>
			</View> */}

			{/* Liste des membres filtrés (amis, demandes reçues, demandes envoyées) */}
			<FlatList
				data={filteredMembers}
				numColumns={2}
				keyExtractor={(item) => item.uid}
				showsVerticalScrollIndicator={false}
				renderItem={({ item }) => <Friend member={item} />}
				contentContainerStyle={{ paddingBottom: 20 }}
				ListEmptyComponent={
					!loading ? (
						<Text style={[styles.emptyText, { color: theme.colors.textTertiary }]}>
							{filter === "friends"
								? t("no_friends")
								: filter === "received"
								? t("no_friend_requests")
								: t("no_sent_requests")}
						</Text>
					) : null
				}
				ListFooterComponent={
					<View style={styles.footer}>
						{hasMoreMembers && !loading ? (
							<Pressable
								onPress={loadMoreMembers}
								style={[
									styles.loadMoreButton,
									{ backgroundColor: theme.colors.backgroundTertiary },
								]}
							>
								<Text
									style={{
										color: theme.colors.primary,
										fontSize: 16,
										fontWeight: "bold",
									}}
								>
									{t("see_more")}
								</Text>
							</Pressable>
						) : loading ? (
							<ActivityIndicator
								size="large"
								color={theme.colors.primary}
								style={{ marginVertical: 16 }}
							/>
						) : null}
					</View>
				}
				style={{ width: "95%", alignSelf: "center" }}
			/>

			{/* Modal pour l'ajout d'ami par code */}
			<AddFriendModal
				visible={showAddFriendModal}
				onClose={() => setShowAddFriendModal(false)}
				currentMember={member}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	addFriendButton: {
		marginHorizontal: 16,
		marginBottom: 16,
		padding: 12,
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	searchContainer: {
		borderWidth: 1,
		borderRadius: 16,
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 10,
		marginBottom: 16,
		alignSelf: "center",
		width: "95%",
	},
	emptyText: {
		textAlign: "center",
		marginTop: 40,
		fontSize: 16,
	},
	footer: {
		alignItems: "center",
		marginVertical: 16,
	},
	loadMoreButton: {
		padding: 12,
		borderRadius: 8,
		width: "95%",
		alignItems: "center",
	},
});

export default FriendList;