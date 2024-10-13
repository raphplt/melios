import HelpModal from "@components/Modals/HelpModal";
import ZoomableView from "@components/Shared/ZoomableView";
import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ViewHelp() {
	const { theme } = useTheme();
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<ZoomableView>
				<Pressable
					className="w-11/12 mx-auto my-[5px] py-6 flex flex-co items-start justify-start"
					style={{
						backgroundColor: theme.colors.cardBackground,
						borderRadius: 10,
						padding: 10,
						margin: 10,
					}}
					onPress={() => setShowModal(true)}
				>
					<Text
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
						className="text-lg font-semibold"
					>
						Besoin d'aide ?{" "}
					</Text>
					<View className="flex flex-row items-center justify-between mt-2">
						<Text
							style={{
								color: theme.colors.text,
							}}
							className="text-[14px] font-normal  mr-2"
						>
							Regardez à nouveau le tutoriel
						</Text>
						<Iconify icon="mdi:chevron-right" size={26} color={theme.colors.text} />
					</View>
				</Pressable>
			</ZoomableView>
			<HelpModal
				visible={showModal}
				setVisible={setShowModal}
				onClose={() => setShowModal(false)}
			/>
		</>
	);
}
