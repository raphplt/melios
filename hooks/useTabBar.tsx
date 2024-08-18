// useTabBarPadding.ts
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";

export function useTabBarPadding(extraPadding: number = 30) {
	const tabBarHeight = useBottomTabBarHeight();

	return useMemo(
		() => tabBarHeight + extraPadding,
		[tabBarHeight, extraPadding]
	);
}
