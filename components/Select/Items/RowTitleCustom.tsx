import { useTheme } from "@context/ThemeContext";
import { ReactNode } from "react";
import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function RowTitleCustom({ title }: { title: string }) {
	const { theme } = useTheme();

	const renderIcon = () => {
		switch (title) {
			case "MOMENT":
				return (
					<Iconify
						icon="mdi:clock-time-four-outline"
						color={theme.colors.text}
						size={22}
					/>
				);
			case "RAPPEL":
				return (
					<Iconify icon="mdi:bell-outline" color={theme.colors.text} size={22} />
				);
			case "RÉPÉTITION":
				return <Iconify icon="mdi:calendar" color={theme.colors.text} size={22} />;
		}
	};

	return (
		<View className="w-11/12 flex flex-row items-center justify-start mt-5 mb-3">
			{renderIcon()}
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className=" ml-2"
			>
				{title}
			</Text>
		</View>
	);
}
