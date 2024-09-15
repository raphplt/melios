import { AntDesign } from "@expo/vector-icons";
import { View, Pressable, Image } from "react-native";
import Points from "./Points";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { useData } from "@context/DataContext";
import getIcon from "@utils/cosmeticsUtils";

export default function LayoutTopRight() {
	const navigation: NavigationProp<ParamListBase> = useNavigation();
	const { theme } = useContext(ThemeContext);
	const { member } = useData();

	return (
		<View style={{ flexDirection: "row", alignItems: "center" }}>
			<Points />
			<Pressable onPress={() => navigation.navigate("account")} className="ml-3">
				{member?.profilePicture ? (
					<Image source={getIcon(member.profilePicture)} className="w-8 h-8 mr-5" />
				) : (
					<AntDesign
						name="user"
						size={24}
						color={theme.colors.text}
						style={{ marginRight: 20 }}
					/>
				)}
			</Pressable>
		</View>
	);
}