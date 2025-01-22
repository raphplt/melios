import PackPreview from "@components/Recompenses/PackPreview";
import ButtonClose from "@components/Shared/ButtonClose";
import { useData } from "@context/DataContext";
import { useTheme } from "@context/ThemeContext";
import React, { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { Iconify } from "react-native-iconify";

const Pack = () => {
	const { selectedPack } = useData();
	const { theme } = useTheme();
	const [unlocked, setUnlocked] = useState(false);
	const [expandedSections, setExpandedSections] = useState<number[]>([]);

	if (!selectedPack) return null;

	const toggleSection = (index: number) => {
		setExpandedSections((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		);
	};

	if (!unlocked)
		return <PackPreview unlocked={unlocked} setUnlocked={setUnlocked} />;

	return (
		<ScrollView
			style={{
				flex: 1,
			}}
		>
			<ButtonClose />

			<View
				className="flex-row items-center p-2 justify-center w-11/12 mx-auto rounded-xl"
				style={{
					borderColor: selectedPack.color ?? theme.colors.backgroundSecondary,
					borderWidth: 2,
					backgroundColor: theme.colors.background,
				}}
			>
				<Text
					className="text-xl font-bold"
					style={{
						color: theme.colors.text,
						fontFamily: "BaskervilleBold",
					}}
				>
					{selectedPack.name}
				</Text>
			</View>

			<ScrollView className="mt-4 mb-10">
				{selectedPack.content.sections.map((section, index) => (
					<View key={index} className="w-11/12 mx-auto">
						<TouchableOpacity
							className="p-1 gap-2 flex justify-between flex-row items-center"
							onPress={() => toggleSection(index)}
						>
							<Text className="text-lg font-bold">{section.title}</Text>

							{expandedSections.includes(index) ? (
								<Iconify icon="mdi:chevron-down" size={20} color={theme.colors.text} />
							) : (
								<Iconify icon="mdi:chevron-up" size={20} color={theme.colors.text} />
							)}
						</TouchableOpacity>
						{expandedSections.includes(index) && (
							<View className="p-2">
								{section.details.map((detail, detailIndex) => (
									<Text key={detailIndex} className="text-base text-[16px] leading-7">
										{detail}
									</Text>
								))}
							</View>
						)}
					</View>
				))}
			</ScrollView>
		</ScrollView>
	);
};

export default Pack;
