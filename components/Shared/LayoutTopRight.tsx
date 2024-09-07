import { AntDesign } from "@expo/vector-icons";
import { SDK_VERSION } from "firebase/app";
import { View, Pressable } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";

export default function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme } = useContext(ThemeContext);

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<Points />
			<Pressable onPress={() => navigation.navigate("account")} className="ml-3">
				<AntDesign
					name="user"
					size={24}
					color={theme.colors.text}
					style={{ marginRight: 20 }}
				/>
			</Pressable>
		</View>
	);
}
