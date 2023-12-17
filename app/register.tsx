import { useContext, useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { createUser } from "../db/users";
import { ThemeContext } from "../components/ThemContext";
import { useNavigation } from "expo-router";

export default function Register() {
	const { theme } = useContext(ThemeContext);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const navigation: any = useNavigation();

	const register = async () => {
		if (password === passwordConfirm) {
			try {
				await createUser(email, password);
				navigation.navigate("index");
			} catch (error) {
				console.error("Erreur lors de la création de l'utilisateur : ", error);
			}
		} else {
			console.log("Les mots de passe ne sont pas identiques");
		}
	};
	return (
		<View style={{ backgroundColor: theme.colors.background }}>
			<Text style={{ color: theme.colors.text }} className="text-center text-2xl">
				Register
			</Text>
			<View className="flex flex-col gap-6 mx-auto justify-center items-center w-full mb-6 mt-12">
				<TextInput
					onChangeText={setEmail}
					value={email}
					placeholder="Email"
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					style={{
						color: theme.colors.text,
						borderColor: theme.colors.border,
						backgroundColor: theme.colors.backgroundSecondary,
					}}
					placeholderTextColor={theme.colors.text}
					className="text-lg w-10/12 mx-auto border-2 rounded-xl pl-2 py-1"
				/>
				<TextInput
					onChangeText={setPassword}
					value={password}
					placeholder="Mot de passe"
					secureTextEntry={true}
					style={{
						color: theme.colors.text,
						borderColor: theme.colors.border,
						backgroundColor: theme.colors.backgroundSecondary,
					}}
					placeholderTextColor={theme.colors.text}
					className="text-lg w-10/12 mx-auto border-2 rounded-xl pl-2 py-1"
				/>
				<TextInput
					onChangeText={setPasswordConfirm}
					value={passwordConfirm}
					placeholder="Confirmer le mot de passe"
					secureTextEntry={true}
					style={{
						color: theme.colors.text,
						borderColor: theme.colors.border,
						backgroundColor: theme.colors.backgroundSecondary,
					}}
					placeholderTextColor={theme.colors.text}
					className="text-lg w-10/12 mx-auto border-2 rounded-xl pl-2 py-1"
				/>
			</View>
			<Button onPress={register} title="S'inscrire" />
		</View>
	);
}
