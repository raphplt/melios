import React, { useState } from "react";
import { Modal, Text, View } from "react-native";
import ModalWrapper from "./ModalWrapper";

const NextLevel = () => {
	const [visible, setVisible] = useState(false);
	return (
		<ModalWrapper visible={visible} setVisible={setVisible}>
			<View>
				<Text>Félicitations, vous avez atteint le prochain niveau !</Text>
			</View>
		</ModalWrapper>
	);
};

export default NextLevel;
