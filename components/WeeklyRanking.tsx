import { View, Text, Animated, TouchableOpacity } from "react-native";
import { LeagueRoom } from "../type/leagueRoom";
import { Member } from "../type/member";
import UserBadge from "./Shared/UserBadge";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "@context/ThemeContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

interface WeeklyRankingProps {
    leagueRoom: LeagueRoom | null;
    currentMember: Member | null;
    creatingRoom: boolean;
}

export const WeeklyRanking = ({
    leagueRoom,
    currentMember,
    creatingRoom,
}: WeeklyRankingProps) => {
    const [timeLeft, setTimeLeft] = useState<string>("");
    const { theme } = useTheme();
    const countdownAnimation = useRef(new Animated.Value(0)).current;
    const slideAnimations = useRef<{ [key: string]: Animated.Value }>({}).current;

    useEffect(() => {
        if (!leagueRoom) return;
        
        const update = () => {
            const endDate = new Date(leagueRoom.weekId);
            endDate.setDate(endDate.getDate() + 7);
            endDate.setHours(23, 59, 59, 999);
            const diff = endDate.getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft("0j 0h");
                return;
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            setTimeLeft(`${days}j ${hours}h`);
        };
        
        update();
        const interval = setInterval(update, 60 * 1000);

        // Countdown animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(countdownAnimation, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(countdownAnimation, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        return () => clearInterval(interval);
    }, [leagueRoom]);

    useEffect(() => {
        if (leagueRoom?.members) {
            leagueRoom.members.forEach((member, index) => {
                if (!slideAnimations[member.uid]) {
                    slideAnimations[member.uid] = new Animated.Value(0);
                }
                
                Animated.timing(slideAnimations[member.uid], {
                    toValue: 1,
                    duration: 300,
                    delay: index * 100,
                    useNativeDriver: true,
                }).start();
            });
        }
    }, [leagueRoom?.members]);

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0: return "🥇";
            case 1: return "🥈";
            case 2: return "🥉";
            default: return `${index + 1}`;
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0: return "#FFD700";
            case 1: return "#C0C0C0";
            case 2: return "#CD7F32";
            default: return "#64748B";
        }
    };

    if (!leagueRoom) {
        return (
            <View className="mx-4 mt-4">
                <LinearGradient
                    colors={['#1F2937', '#374151']}
                    className="rounded-2xl p-8 items-center"
                >
                    <Animated.View
                        style={{
                            transform: [{
                                rotate: countdownAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ['0deg', '360deg'],
                                })
                            }]
                        }}
                    >
                        <MaterialCommunityIcons
                            name={creatingRoom ? "loading" : "trophy-outline"}
                            size={48}
                            color="#6B7280"
                        />
                    </Animated.View>
                    <Text className="text-gray-400 text-lg mt-4 text-center font-medium">
                        {creatingRoom
                            ? "Création d'une nouvelle salle en cours..."
                            : "Aucune salle de ligue cette semaine"}
                    </Text>
                    {creatingRoom && (
                        <Text className="text-gray-500 text-sm mt-2 text-center">
                            Veuillez patienter...
                        </Text>
                    )}
                </LinearGradient>
            </View>
        );
    }

    const sortedMembers = [...leagueRoom.members].sort(
        (a, b) => (b.league?.points || 0) - (a.league?.points || 0)
    );
    const maxPoints = sortedMembers[0]?.league?.points || 0;

    return (
        <View className="mx-4">
            {/* Header with countdown */}
            <LinearGradient
                colors={['#7C3AED', '#A855F7']}
                className="rounded-t-2xl p-4"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="timer" size={24} color="white" />
                        <Text className="text-white text-lg font-bold ml-2">
                            Classement Hebdomadaire
                        </Text>
                    </View>
                    <Animated.View
                        style={{
                            opacity: countdownAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.7, 1],
                            }),
                        }}
                        className="bg-white/20 rounded-lg px-3 py-1"
                    >
                        <Text className="text-white font-bold text-sm">
                            {timeLeft}
                        </Text>
                    </Animated.View>
                </View>
            </LinearGradient>

            {/* Ranking list */}
            <View className="bg-gray-900 rounded-b-2xl overflow-hidden">
                {sortedMembers.map((member, idx) => {
                    const isCurrentUser = member.uid === currentMember?.uid;
                    const slideAnim = slideAnimations[member.uid] || new Animated.Value(1);
                    
                    return (
                        <Animated.View
                            key={member.uid}
                            style={{
                                opacity: slideAnim,
                                transform: [{
                                    translateX: slideAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [100, 0],
                                    })
                                }]
                            }}
                        >
                            <TouchableOpacity
                                className={`p-4 border-b border-gray-800 ${
                                    isCurrentUser ? 'bg-yellow-400/10' : ''
                                }`}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-center">
                                    {/* Rank */}
                                    <View
                                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: getRankColor(idx) }}
                                    >
                                        <Text className="text-white font-bold text-lg">
                                            {idx < 3 ? getRankIcon(idx) : idx + 1}
                                        </Text>
                                    </View>

                                    {/* User info */}
                                    <UserBadge
                                        width={40}
                                        height={40}
                                        style={{
                                            marginRight: 12,
                                            borderWidth: isCurrentUser ? 2 : 0,
                                            borderColor: '#FFD700',
                                        }}
                                        customProfilePicture={member.profilePicture || ""}
                                    />

                                    <View className="flex-1">
                                        <Text
                                            className={`text-base font-medium ${
                                                isCurrentUser ? 'text-yellow-400' : 'text-white'
                                            }`}
                                            numberOfLines={1}
                                        >
                                            {member.nom}
                                            {isCurrentUser && (
                                                <Text className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded ml-2">
                                                    VOUS
                                                </Text>
                                            )}
                                        </Text>
                                    </View>

                                    {/* Points */}
                                    <View className="items-end">
                                        <Text className="text-yellow-400 font-bold text-lg">
                                            {member.league?.points || 0}
                                        </Text>
                                        <Text className="text-gray-400 text-xs">pts</Text>
                                    </View>
                                </View>

                                {/* Progress bar */}
                                <View className="mt-3 ml-16">
                                    <View className="w-full h-2 bg-gray-700 rounded-full">
                                        <LinearGradient
                                            colors={idx === 0 ? ['#FFD700', '#FFA500'] : ['#64748B', '#475569']}
                                            className="h-2 rounded-full"
                                            style={{
                                                width: `${((member.league?.points || 0) / (maxPoints || 1)) * 100}%`,
                                            }}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>

            {/* Footer stats */}
            <View className="bg-gray-800 rounded-b-lg p-4 mt-2">
                <View className="flex-row justify-around">
                    <View className="items-center">
                        <MaterialCommunityIcons name="account-group" size={24} color="#6B7280" />
                        <Text className="text-gray-400 text-xs mt-1">Participants</Text>
                        <Text className="text-white font-bold">{sortedMembers.length}</Text>
                    </View>
                    <View className="items-center">
                        <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
                        <Text className="text-gray-400 text-xs mt-1">Record</Text>
                        <Text className="text-white font-bold">{maxPoints}</Text>
                    </View>
                    <View className="items-center">
                        <MaterialCommunityIcons name="trending-up" size={24} color="#10B981" />
                        <Text className="text-gray-400 text-xs mt-1">Moyenne</Text>
                        <Text className="text-white font-bold">
                            {Math.round(sortedMembers.reduce((acc, m) => acc + (m.league?.points || 0), 0) / sortedMembers.length) || 0}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};