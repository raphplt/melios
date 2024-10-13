import { View, Text } from "react-native";
import ModalWrapper from "./ModalWrapper";
import { Iconify } from "react-native-iconify";

export default function HelpModal({
	visible,
	setVisible,
	onClose,
}: {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	onClose: () => void;
}) {
	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<Iconify icon="mdi:close" size={26} color="black" onPress={onClose} />
			<View>
				<Text>Help Modal</Text>
			</View>
		</ModalWrapper>
	);
}