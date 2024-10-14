import { useTheme } from "@context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

type Props = {
	title: string;
	show: boolean;
	setShow: (show: boolean) => void;
	icon: string;
	children: React.ReactNode;
};

export default function SectionHeader({
	title,
	show,
	setShow,
	icon,
	children,
}: Props) {
	const { theme } = useTheme();

	const renderIcon = () => {
		switch (icon) {
			case "calendar":
				return (
					<Iconify icon="mdi-calendar" size={22} color={theme.colors.primary} />
				);
			case "graph":
				return (
					<Iconify icon="mdi-chart-line" size={22} color={theme.colors.primary} />
				);
		}
	};

	return (
		<>
			<Pressable
				className="flex flex-row w-11/12 rounded-xl px-2 py-2 mx-auto items-center justify-between mt-2"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				onPress={() => setShow(!show)}
			>
				<View className="flex flex-row items-center">
					{renderIcon()}
					<Text
						className="text-[16px] mx-2 font-semibold"
						style={{
							color: theme.colors.text,
						}}
					>
						{title}
					</Text>
				</View>

				<Ionicons
					name={show ? "chevron-up" : "chevron-down"}
					size={24}
					color={theme.colors.primary}
				/>
			</Pressable>
			{show && children}
		</>
	);
}
