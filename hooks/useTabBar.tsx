// useTabBarPadding.ts
// import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";

export function useTabBarPadding(extraPadding: number = 30) {
	// const tabBarHeight = useBottomTabBarHeight();
	const tabBarHeight = 50; //TODO : TEMP !!!!!!!!!!!!!!!!

	return useMemo(
		() => tabBarHeight + extraPadding,
		[tabBarHeight, extraPadding]
	);
}
