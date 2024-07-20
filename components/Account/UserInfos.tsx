import React, { useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function UserInfos({ data }) {
	const [showHabits, setShowHabits] = useState(false);

	const toggleHabits = () => {
		setShowHabits(!showHabits);
	};

	return (
		<ScrollView className="p-4 bg-gray-100 mb-6">
			<Text className="w-11/12 mx-auto mb-4 text-lg font-semibold">
				Mes informations
			</Text>
			<View className="bg-white p-4 rounded-lg shadow-md mb-4">
				<Text className="text-lg font-semibold">Nom:</Text>
				<Text className="mb-2">{data.nom}</Text>

				<Text className="text-lg font-semibold">Motivation:</Text>
				<Text className="mb-2">{data.motivation.answer}</Text>

				<Text className="text-lg font-semibold">Objectifs:</Text>
				{data.objectifs.map((objectif, index) => (
					<Text key={index} className="mb-2">
						{objectif.answer}
					</Text>
				))}

				<Text className="text-lg font-semibold">Temps quotidien:</Text>
				<Text className="mb-2">{data.temps.answer}</Text>
			</View>

			<View className="bg-white p-4 rounded-lg shadow-md mb-4">
				<Text className="text-lg font-semibold">Aspects:</Text>
				{data.aspects.map((aspect, index) => (
					<Text key={index} className="mb-2">
						{aspect.answer}
					</Text>
				))}
			</View>

			<View className="bg-white p-4 rounded-lg shadow-md">
				<Pressable
					onPress={toggleHabits}
					className="flex flex-row justify-between items-center mb-4"
				>
					<Text className="text-lg font-semibold">Habitudes:</Text>
					<FontAwesome
						name={showHabits ? "chevron-up" : "chevron-down"}
						size={24}
						color="black"
					/>
				</Pressable>
				{showHabits &&
					data.habits.map((habit) => (
						<View key={habit.id} className="mb-4 p-4 bg-gray-50 rounded-lg shadow">
							<Text className="text-base font-semibold">{habit.name}</Text>
							<Text className="text-sm text-gray-600">Moment: {habit.moment}</Text>
						</View>
					))}
			</View>
		</ScrollView>
	);
}
