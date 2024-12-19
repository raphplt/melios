import { useTheme } from "@context/ThemeContext";
import { Member } from "@type/member";
import React from "react";
import { Text, View } from "react-native";

type Props = {
	member: Member;
};

const Friend = ({ member }: Props) => {
	const { theme } = useTheme();
	return (
		<View
			className="flex flex-row items-center justify-between w-full p-2 rounded-lg"
			style={{
				backgroundColor: theme.colors.background,
				borderColor: theme.colors.border,
				borderWidth: 1,
			}}
			key={member.uid}
		>
			<Text>{member.nom}</Text>
		</View>
	);
};

export default Friend;
