import { Pressable } from "react-native";
import { Text, View } from "react-native";

export default function LoginView({ theme, navigation }) {
	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text
				className=" ml-6 mb-4 text-xl mt-6 text-center"
				style={{ color: theme.colors.text }}
			>
				Non connecté
			</Text>
			<Pressable
				onPress={() => navigation.navigate("register")}
				className=" bg-blue-300 py-2 px-4 rounded-2xl w-2/3 mx-auto mt-4"
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-lg text-center"
				>
					Inscription
				</Text>
			</Pressable>
			<Text
				className="text-xl text-center my-3"
				style={{ color: theme.colors.text }}
			>
				ou
			</Text>
			<Pressable
				onPress={() => navigation.navigate("login")}
				className="mx-auto bg-green-300 py-2 px-4 rounded-2xl w-2/3"
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-lg text-center"
				>
					Connexion
				</Text>
			</Pressable>
		</View>
	);
}
