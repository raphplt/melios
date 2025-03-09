import React, { useState, useEffect, useMemo } from "react";
import { Text, View, Pressable, ImageBackground } from "react-native";
import CachedImage from "@components/Shared/CachedImage";
import { Iconify } from "react-native-iconify";
import { useTranslation } from "react-i18next";
import { useTheme } from "@context/ThemeContext";
import getIcon from "@utils/cosmeticsUtils";
import { useData } from "@context/DataContext";
import { DailyLogExtended } from "@db/logs";
import { FontAwesome6 } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import ReactionModal from "@components/Modals/ReactionModal";
import { catImgs } from "@utils/categoriesBg";
import { useHabits } from "@context/HabitsContext";
import { BlurView } from "expo-blur";
import { maj, reduceText } from "@utils/textUtils";
import AnimatedPlaceholder from "@components/Shared/AnimatedPlaceholder";

const renderEmoji = (type: string, theme: any) => {
	switch (type) {
		case "flame":
			return (
				<Iconify icon="mdi-fire" size={18} color={theme.colors.orangePrimary} />
			);
		case "heart":
			return (
				<Iconify icon="mdi-heart" size={18} color={theme.colors.redPrimary} />
			);
		case "like":
			return (
				<Iconify icon="mdi-thumb-up" size={18} color={theme.colors.primary} />
			);
		case "flame":
			return (
				<Iconify icon="mdi-fire" size={18} color={theme.colors.orangePrimary} />
			);
	}
};

export const DailyLogItem = ({ item }: { item: DailyLogExtended }) => {
	const { theme } = useTheme();
	const { t } = useTranslation();
	const { member } = useData();
	const { categories } = useHabits();

	const [popoverVisible, setPopoverVisible] = useState(false);
	const [reactions, setReactions] = useState(item.reactions);

	const safeDate = useMemo(() => {
		if (item.date instanceof Date) return item.date;
		if (item.date && typeof (item.date as any).toDate === "function") {
			return (item.date as Timestamp).toDate();
		}
		return new Date(item.date);
	}, [item.date]);

	useEffect(() => {
		if (item.user?.profilePicture) {
			const uri = getIcon(item.user.profilePicture);
			setProfilePictureUri(uri);
		}
	}, [item.user]);

	const [profilePictureUri, setProfilePictureUri] = useState<string | null>(
		null
	);

	const userReaction = useMemo(() => {
		return reactions.find((r) => r.uid === member?.uid)?.type || null;
	}, [reactions, member?.uid]);

	const reactionCounts = useMemo(() => {
		return reactions.reduce((acc: Record<string, number>, r) => {
			acc[r.type] = (acc[r.type] || 0) + 1;
			return acc;
		}, {});
	}, [reactions]);

	const cat = item.habit?.category;
	const habitCategory = categories && categories.find((c) => c.category === cat);

	return (
		<>
			<ImageBackground
				source={catImgs[habitCategory?.slug || "sport"]}
				style={{ flex: 1, elevation: 2 }}
				imageStyle={{ resizeMode: "cover" }}
				className="py-2 px-2 my-[6px] rounded-xl overflow-hidden w-full"
			>
				<View className="flex flex-row justify-between items-start">
					<BlurView
						style={{ alignSelf: "flex-start" }}
						className="flex flex-row items-center mb-2 p-1 rounded-full overflow-hidden px-1 "
						tint="extraLight"
						intensity={100}
					>
						<CachedImage
							imagePath={profilePictureUri || "images/cosmetics/man.png"}
							style={{ width: 20, height: 20, marginRight: 8 }}
							placeholder={
								<AnimatedPlaceholder marginRight={8} width={20} height={20} />
							}
						/>
						<Text className="text-base font-bold mr-1 text-black">
							{item.user?.nom || "??"}
						</Text>
					</BlurView>
					<BlurView
						style={{ alignSelf: "flex-end" }}
						className="flex flex-row items-center mb-2 p-[6px] rounded-full overflow-hidden px-2 gap-2"
						tint="extraLight"
						intensity={100}
					>
						<FontAwesome6
							name={item.habit?.icon || "question"}
							size={16}
							color={item.habit?.color ?? theme.colors.text}
						/>
						<Text
							className="text-center text-sm font-semibold text-black"
							numberOfLines={2}
						>
							{reduceText(item.habit?.name, 25) || ""}
						</Text>
					</BlurView>
				</View>
				<View className="flex flex-row justify-between items-end mt-24">
					<BlurView
						style={{ alignSelf: "flex-start" }}
						className="flex flex-row items-center p-1 rounded-full overflow-hidden px-2 gap-1"
						tint="extraLight"
						intensity={100}
					>
						<Iconify icon="mingcute:time-line" size={16} color={"#1f2937"} />
						<Text className="text-sm text-gray-800  font-semibold italic">
							{maj(t("the"))} {safeDate.toLocaleDateString("fr-FR")}
						</Text>
					</BlurView>

					<Pressable onPress={() => setPopoverVisible(true)}>
						{Object.keys(reactionCounts).length ? (
							<View
								className="p-1 rounded-full"
								style={{
									flexDirection: "row",
									alignItems: "center",
									backgroundColor: theme.colors.background,
								}}
							>
								{Object.entries(reactionCounts).map(([rType, count]) => (
									<View key={rType} className="flex flex-row items-center gap-1">
										<Text
											style={{ color: theme.colors.text }}
											className="text-sm font-bold ml-1"
										>
											{count}
										</Text>
										{renderEmoji(rType, theme)}
									</View>
								))}
							</View>
						) : (
							<View
								className="p-2 rounded-full"
								style={{ backgroundColor: theme.colors.background }}
							>
								<Iconify icon="mdi-heart" size={18} color={theme.colors.redPrimary} />
							</View>
						)}
					</Pressable>
				</View>
			</ImageBackground>

			<ReactionModal
				visible={popoverVisible}
				setVisible={setPopoverVisible}
				item={item}
				member={member}
				theme={theme}
				t={t}
				userReaction={userReaction}
				reactions={reactions}
				setReactions={setReactions}
				safeDate={safeDate}
			/>
		</>
	);
};