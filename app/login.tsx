import { useContext, useState } from "react";
import { View, TextInput, Pressable, Text } from "react-native";
import { loginUser } from "../db/users";
import { ThemeContext } from "../components/ThemContext";
import { useNavigation } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";

export default function Login() {
	const { theme } = useContext(ThemeContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigation: any = useNavigation();

	const login = async () => {
		try {
			const user: any = await loginUser(email, password);

			if (user.error) {
				setError(user.error);
				return;
			} else {
				navigation.navigate("(navbar)");
			}
		} catch (error) {
			console.error("Erreur lors de la création de l'utilisateur : ", error);
		}
	};
	return (
		<View
			style={{ backgroundColor: theme.colors.background }}
			className="flex flex-col h-[100vh] justify-start mt-24 items-center w-full"
		>
			<Text style={{ color: theme.colors.text }} className="text-3xl font-bold">
				Connexion à Melios
			</Text>
			<View className="flex flex-col gap-6 mx-auto justify-center items-center w-full  mt-12">
				<TextInput
					onChangeText={setEmail}
					value={email}
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					style={{
						color: theme.colors.text,
					}}
					placeholderTextColor={"#333333"}
					className="text-lg w-10/12 mx-auto pl-4 py-5 pb-2 border-b-2 "
				/>
				<TextInput
					onChangeText={setPassword}
					value={password}
					placeholder="Mot de passe"
					secureTextEntry={true}
					style={{
						color: theme.colors.text,
					}}
					placeholderTextColor={"#333333"}
					className="text-lg w-10/12 mx-auto pl-4 py-5 pb-2 border-b-2 "
				/>
			</View>
			<Text className="text-center text-lg mt-6 text-red-500 mb-12">{error}</Text>
			<Pressable
				onPress={login}
				style={{
					backgroundColor: theme.colors.primary,
				}}
				className="w-10/12 mx-auto py-2 rounded-3xl focus:bg-blue-800 mb-4 flex items-center"
			>
				<Text
					style={{ color: theme.colors.textSecondary }}
					className="text-xl text-center"
				>
					Se connecter
				</Text>
			</Pressable>

			<Pressable
				onPress={() => navigation.navigate("register")}
				className="bg-gray-200 p-2 rounded-xl mt-4 w-1/3 mx-auto border-[1px] border-gray-300"
			>
				<Text className="text-center text-md">Ou s'inscrire</Text>
			</Pressable>
		</View>
	);
}
