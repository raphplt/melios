import React, { ReactNode, useState } from "react";
import {
	Modal,
	Pressable,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ContextMenuWrapperProps = {
	children: ReactNode;
	onEdit: () => void;
	onDelete: () => void;
};

const ContextMenuWrapper = ({
	children,
	onEdit,
	onDelete,
}: ContextMenuWrapperProps) => {
	const [menuVisible, setMenuVisible] = useState(false);

	const openMenu = () => setMenuVisible(true);
	const closeMenu = () => setMenuVisible(false);

	return (
		<View>
			<Pressable
				onLongPress={openMenu}
				delayLongPress={300} // Durée personnalisée pour l'appui long
				android_ripple={{ color: "rgba(0, 0, 0, 0.1)" }} // Ajout d'un effet tactile sur Android
			>
				{children}
			</Pressable>

			{/* Menu contextuel */}
			<Modal
				transparent
				visible={menuVisible}
				animationType="fade"
				onRequestClose={closeMenu}
			>
				<Pressable
					style={{
						flex: 1,
						backgroundColor: "rgba(0, 0, 0, 0.5)",
						justifyContent: "center",
						alignItems: "center",
					}}
					onPress={closeMenu}
				>
					<View
						style={{
							backgroundColor: "#fff",
							padding: 15,
							borderRadius: 10,
							width: 200,
							alignItems: "center",
						}}
					>
						<TouchableOpacity
							onPress={() => {
								onEdit();
								closeMenu();
							}}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Ionicons name="pencil" size={20} color="#000" />
							<Text style={{ marginLeft: 10 }}>Edit</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								onDelete();
								closeMenu();
							}}
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Ionicons name="trash" size={20} color="red" />
							<Text style={{ marginLeft: 10, color: "red" }}>Delete</Text>
						</TouchableOpacity>
					</View>
				</Pressable>
			</Modal>
		</View>
	);
};

export default ContextMenuWrapper;
