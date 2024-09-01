import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Modal, View, Text } from "react-native";
export default function CustomModal({
	visible,
	children,
	onClose,
	title,
	subtitle,
}: {
	visible: boolean;
	children: React.ReactNode;
	onClose: (visible: boolean) => void;
	title?: string;
	subtitle?: string;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<Modal
			transparent={true}
			visible={visible}
			onRequestClose={() => {
				onClose(!visible);
			}}
		>
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "row",
					backgroundColor: "rgba(0,0,0,0.5)",
				}}
			>
				<View
					style={{
						backgroundColor: theme.colors.background,
						shadowColor: "#000",
						shadowOffset: { width: 0, height: 2 },
						shadowOpacity: 0.25,
						shadowRadius: 4,
						elevation: 5,
					}}
					className="rounded-md py-5 px-5 w-11/12 flex flex-col"
				>
					<Text
						style={{
							color: theme.colors.textTertiary,
						}}
						className="text-[16px] font-semibold mb-4"
					>
						{title}
					</Text>
					<Text
						style={{
							color: theme.colors.textTertiary,
						}}
						className="text-[14px] mb-5"
					>
						{subtitle}
					</Text>
					<View className="flex flex-row justify-evenly">{children}</View>
				</View>
			</View>
		</Modal>
	);
}
