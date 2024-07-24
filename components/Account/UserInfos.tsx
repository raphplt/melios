import React, { useContext, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { UserDatas } from "../../types/user";
import { Iconify } from "react-native-iconify";
import { ThemeContext } from "../ThemeContext";

export default function UserInfos({ data }: { data: UserDatas }) {
	const [showHabits, setShowHabits] = useState(false);
	const { theme, toggleTheme } = useContext(ThemeContext);

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
						{data.nom}
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
						{data.motivation.answer}
					</Text>
				</View>
				<View className="flex w-full mx-auto mb-2 flex-col">
					<View className="flex items-center flex-row">
						<Iconify size={24} color={theme.colors.text} icon="ph:target" />
						<Text className="text-lg ml-2" style={{ color: theme.colors.text }}>
							Objectifs
						</Text>
					</View>
					{data.objectifs.map((objectif, index) => (
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
						{data.temps.answer}
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
				{data.aspects.map((aspect, index) => (
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
					data.habits.map((habit) => (
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
