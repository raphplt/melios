import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import { ProfileCosmetic } from "@type/cosmetics";
import getIcon from "@utils/cosmeticsUtils";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { getMemberInfos, updateProfilePicture } from "@db/member";
import { Iconify } from "react-native-iconify";
import CachedImage from "@components/Shared/CachedImage";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

function ProfilIcon({ cosmetic }: { cosmetic: ProfileCosmetic }) {
    const { theme } = useTheme();
    const { usersLevels, setMember, member } = useData();

    const globalLevel = useMemo(
        () => usersLevels["P0gwsxEYNJATbmCoOdhc" as any],
        [usersLevels]
    );
    const isGrayedOut = cosmetic.level > globalLevel.currentLevel;
    const selected = member?.profilePicture === cosmetic.slug;

    const [iconPath, setIconPath] = useState<string>("");

    useEffect(() => {
        const fetchIcon = async () => {
            try {
                const slug = cosmetic.slug && cosmetic.slug !== "undefined" ? cosmetic.slug : "man";
                const path = getIcon(slug);
                setIconPath(path);
            } catch (error) {
                console.error("Failed to fetch icon:", error);
            }
        };

        fetchIcon();
    }, [cosmetic.slug]);

    const scale = useSharedValue(1);
    const fogTranslation = useSharedValue(0);

    const glowStyle = useAnimatedStyle(() => ({
        shadowOpacity: withTiming(selected ? 0.8 : 0),
        shadowRadius: withTiming(selected ? 5 : 0),
        shadowColor: theme.colors.primary,
        style: { shadowOffset: { width: 0, height: 0 } },
        transform: [{ scale: withTiming(scale.value, { duration: 150 }) }],
    }));

    useEffect(() => {
        if (isGrayedOut) {
            fogTranslation.value = 10;
        }
    }, [isGrayedOut, fogTranslation]);

    const handlePress = useCallback(async () => {
        if (!isGrayedOut) {
            scale.value = 0.9;
            setTimeout(() => (scale.value = 1), 150);
            await updateProfilePicture(cosmetic.slug);
            const updatedMember = await getMemberInfos({ forceRefresh: true });
            setMember(updatedMember);
        }
    }, [cosmetic.slug, isGrayedOut, scale, setMember]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            disabled={isGrayedOut}
            className="flex flex-col items-center w-1/3 mx-auto my-1 py-2 rounded-xl"
        >
            <Animated.View
                style={[
                    {
                        backgroundColor: isGrayedOut
                            ? theme.colors.grayPrimary
                            : selected
                            ? theme.colors.backgroundTertiary
                            : theme.colors.cardBackground,
                        borderColor: selected ? theme.colors.primary : theme.colors.grayPrimary,
                        borderRadius: 12,
                        opacity: isGrayedOut ? 0.5 : 1,
                    },
                    glowStyle,
                ]}
                className="items-center justify-center p-3"
            >
                {/* Nom */}
                <Text
                    numberOfLines={1}
                    style={{
                        color: theme.colors.text,
                        fontFamily: "BaskervilleBold",
                    }}
                    ellipsizeMode="tail"
                    className="text-center font-semibold mb-1 w-28"
                >
                    {cosmetic.name}
                </Text>

                {/* Icône */}
                {iconPath ? (
                    <CachedImage imagePath={iconPath} className="w-24 h-24" />
                ) : (
                    <ShimmerPlaceholder
                        width={80}
                        height={80}
                        style={{
                            borderRadius: 40,
                            marginRight: 12,
                        }}
                    />
                )}
                {/* Prix & Icones */}
                <View className="flex flex-row items-center justify-center py-2">
                    <Text
                        className="mx-1 font-semibold"
                        style={{
                            color: isGrayedOut
                                ? theme.colors.text
                                : selected
                                ? theme.colors.primary
                                : theme.colors.yellowPrimary,
                        }}
                    >
                        {cosmetic.level}
                    </Text>
                    {isGrayedOut ? (
                        <Iconify
                            icon="ic:baseline-lock"
                            size={20}
                            color={theme.colors.textTertiary}
                        />
                    ) : selected ? (
                        <Iconify icon="mdi:check-circle" size={20} color={theme.colors.primary} />
                    ) : (
                        <Iconify
                            icon="material-symbols:trophy"
                            size={20}
                            color={theme.colors.yellowPrimary}
                        />
                    )}
                </View>
            </Animated.View>
        </TouchableOpacity>
    );
}

export default React.memo(ProfilIcon);