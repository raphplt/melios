// Filters.tsx
import { useTheme } from "@context/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { FriendFilter } from "../../app/friendList";

type FiltersProps = {
	filter: FriendFilter;
	setFilter: (filter: FriendFilter) => void;
	member: any;
};

const Filters = ({ filter, setFilter, member }: FiltersProps) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const filterStyle = {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 8,
		marginHorizontal: 8,
	};

	return (
		<View
			style={{
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				marginBottom: 16,
			}}
		>
			<TouchableOpacity
				onPress={() => setFilter("friends")}
				style={{
					backgroundColor:
						filter === "friends" ? theme.colors.primary : theme.colors.cardBackground,
					...filterStyle,
				}}
			>
				<Text
					style={{
						color:
							filter === "friends" ? theme.colors.textSecondary : theme.colors.text,
					}}
				>
					{t("friends")} ({member?.friends?.length || 0})
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
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
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => setFilter("sent")}
				style={{
					backgroundColor:
						filter === "sent" ? theme.colors.primary : theme.colors.cardBackground,
					...filterStyle,
				}}
			>
				<Text
					style={{
						color: filter === "sent" ? theme.colors.textSecondary : theme.colors.text,
					}}
				>
					{t("sent")} ({member?.friendRequestsSent?.length || 0})
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Filters;
