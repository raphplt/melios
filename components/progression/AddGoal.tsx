import { ThemeContext } from "@context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { Iconify } from "react-native-iconify";
import ModalGoal from "./ModalGoal";
import { getMemberGoal } from "@db/goal";
import { useData } from "@context/DataContext";

export default function AddGoal() {
	const { theme } = useContext(ThemeContext);
	const [visible, setVisible] = useState(false);
	const { member } = useData();

	const { width } = Dimensions.get("window");

	useEffect(() => {
		const getGoal = async () => {
			if (!member?.uid) return;
			await getMemberGoal(member?.uid);
		};
		getGoal();
	}, []);

	return (
		<View
			className="rounded-xl flex-1"
			style={{
				width: width,
			}}
		>
			<Pressable
				className="w-11/12 h-10 mx-auto my-3 flex items-center justify-start flex-row px-2"
				style={{
					borderStyle: "dashed",
					borderRadius: 10,
					borderWidth: 2,
					borderColor: theme.colors.primary,
				}}
				onPress={() => setVisible(true)}
			>
				<>
					<Text
						style={{
							color: theme.colors.primary,
						}}
						className="text-[16px] font-semibold"
					>
						Définir un objectif
					</Text>
					<Iconify
						icon="bi:arrow-right"
						size={20}
						color={theme.colors.primary}
						style={{ marginLeft: "auto" }}
					/>
				</>
			</Pressable>

			<ModalGoal visible={visible} setVisible={setVisible} />
		</View>
	);
}
