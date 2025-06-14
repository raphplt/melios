import { useState, useCallback } from "react";
import { getMemberInfos } from "../db/member";
import { CacheManager } from "../utils/CacheManager";
import { Member } from "../type/member";

/**
 * Hook pour gérer le rafraîchissement des données de ligue
 */
export const useRefreshLeagueData = () => {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const refreshMemberData = useCallback(
		async (setMember: (member: Member) => void): Promise<Member | null> => {
			if (isRefreshing) return null;

			setIsRefreshing(true);
			try {
				// Forcer le rechargement depuis Firebase
				const freshMemberData = await getMemberInfos({ forceRefresh: true });

				if (freshMemberData) {
					setMember(freshMemberData);
					console.log("League data refreshed successfully");
					return freshMemberData;
				}

				return null;
			} catch (error) {
				console.error("Error refreshing league data:", error);
				return null;
			} finally {
				setIsRefreshing(false);
			}
		},
		[isRefreshing]
	);

	const clearCacheAndRefresh = useCallback(
		async (setMember: (member: Member) => void): Promise<Member | null> => {
			if (isRefreshing) return null;

			setIsRefreshing(true);
			try {
				// Vider le cache puis recharger
				await CacheManager.clearMemberCache();
				const freshMemberData = await getMemberInfos({ forceRefresh: true });

				if (freshMemberData) {
					setMember(freshMemberData);
					console.log("Cache cleared and league data refreshed");
					return freshMemberData;
				}

				return null;
			} catch (error) {
				console.error("Error clearing cache and refreshing:", error);
				return null;
			} finally {
				setIsRefreshing(false);
			}
		},
		[isRefreshing]
	);

	return {
		isRefreshing,
		refreshMemberData,
		clearCacheAndRefresh,
	};
};
