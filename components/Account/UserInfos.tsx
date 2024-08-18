import React, { useContext, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Member } from "../../types/member";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "../../context/ThemeContext";
import { UserHabit } from "../../types/userHabit";

export default function UserInfos({ member }: { member: Member }) {
	const [showHabits, setShowHabits] = useState(false);
	const { theme } = useContext(ThemeContext);

	const toggleHabits = () => {
		setShowHabits(!showHabits);
	};

	return (
		<ScrollView
			className="p-4 mb-6 w-[95%] mx-auto rounded-xl"
			style={{ backgroundColor: theme.colors.textSecondary }}
		>
			<View className="flex w-full font-semibold mx-auto mb-4 flex-row items-center ">
				<Text
					className="text-lg font-semibold ml-3"
					style={{ color: theme.colors.text }}
				>
					Mes informations
				</Text>
			</View>
			<View
				className="p-4 rounded-lg shadow-md mb-4"
				style={{ backgroundColor: theme.colors.background }}
			>
				<View className="flex w-full mx-auto mb-2 flex-col">
					<View className="flex items-center flex-row">
						<Iconify
							size={24}
							color={theme.colors.text}
							icon="solar:user-circle-outline"
						/>

						<Text className="text-lg ml-2" style={{ color: theme.colors.text }}>
							Nom
						</Text>
					</View>
					<Text className="mb-2 mt-1" style={{ color: theme.colors.text }}>
						{member.nom}
					</Text>
				</View>
				<View className="flex w-full mx-auto mb-2 flex-col">
					<View className="flex items-center flex-row">
						<Iconify
							size={24}
							color={theme.colors.text}
							icon="mdi:arm-flex-outline"
						/>
						<Text className="text-lg ml-2" style={{ color: theme.colors.text }}>
							Motivation
						</Text>
					</View>
					<Text className="mb-2" style={{ color: theme.colors.text }}>
						{member.motivation.answer}
					</Text>
				</View>
				<View className="flex w-full mx-auto mb-2 flex-col">
					<View className="flex items-center flex-row">
						<Iconify size={24} color={theme.colors.text} icon="ph:target" />
						<Text className="text-lg ml-2" style={{ color: theme.colors.text }}>
							Objectifs
						</Text>
					</View>
					{member.objectifs.map((objectif, index) => (
						<Text
							key={index.toString()}
							className="mb-2"
							style={{ color: theme.colors.text }}
						>
							{objectif.answer}
						</Text>
					))}
				</View>
				<View className="flex w-full mx-auto mb-2 flex-col">
					<View className="flex items-center flex-row">
						<Iconify size={24} color={theme.colors.text} icon="carbon:time" />
						<Text className="text-lg ml-2" style={{ color: theme.colors.text }}>
							Temps quotidien
						</Text>
					</View>
					<Text className="mb-2" style={{ color: theme.colors.text }}>
						{member.temps.answer}
					</Text>
				</View>
			</View>

			<View
				className="p-4 rounded-lg shadow-md mb-4"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Text
					className="text-lg font-semibold"
					style={{ color: theme.colors.text }}
				>
					Aspects
				</Text>
				{member.aspects.map((aspect, index) => (
					<Text
						key={index.toString()}
						className="mb-2"
						style={{ color: theme.colors.text }}
					>
						{aspect.answer}
					</Text>
				))}
			</View>

			<View
				className="p-4 rounded-lg shadow-md"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Pressable
					onPress={toggleHabits}
					className="flex flex-row justify-between items-center mb-4"
				>
					<Text
						className="text-lg font-semibold"
						style={{ color: theme.colors.text }}
					>
						Habitudes
					</Text>
					<FontAwesome
						name={showHabits ? "chevron-up" : "chevron-down"}
						size={24}
						color={theme.colors.text}
					/>
				</Pressable>
				{showHabits &&
					member.habits.map((habit: UserHabit) => (
						<View
							key={habit.id}
							className="mb-4 p-4 rounded-lg shadow"
							style={{ backgroundColor: theme.colors.backgroundSecondary }}
						>
							<Text
								className="text-base font-semibold"
								style={{ color: theme.colors.text }}
							>
								{habit.name}
							</Text>
							<Text className="text-sm" style={{ color: theme.colors.text }}>
								Moment {habit.moment}
							</Text>
						</View>
					))}
			</View>
		</ScrollView>
	);
}
