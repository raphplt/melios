import { View, Text } from "react-native";
import ModalWrapper from "./ModalWrapper";

export default function HelpModal({
	visible,
	onClose,
}: {
	visible: boolean;
	setVisible: any;
	onClose: () => void;
}) {
	return (
		<ModalWrapper visible={true} setVisible={onClose}>
			<View>
				<Text>Help Modal</Text>
			</View>
		</ModalWrapper>
	);
}
