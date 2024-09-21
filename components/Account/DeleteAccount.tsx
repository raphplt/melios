import React, { useContext, useState } from "react";
import { View, Text, TextInput, Alert, Pressable } from "react-native";
import {
	getAuth,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { deleteUserAccount } from "@db/users";
import { ThemeContext } from "@context/ThemeContext";
import { Iconify } from "react-native-iconify";
import AccountBlock from "./AccountBlock";

export default function DeleteAccount() {
	const { theme } = useContext(ThemeContext);
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [showPasswordInput, setShowPasswordInput] = useState(false);

	const handleDeleteAccount = async () => {
		const auth = getAuth();
		const user = auth.currentUser;

		if (user && user.email && password) {
			const credential = EmailAuthProvider.credential(user.email, password);

			try {
				await reauthenticateWithCredential(user, credential);
				await deleteUserAccount();
				Alert.alert("Success", "Account deleted successfully.");
			} catch (error) {
				setError(
					"Échec de la suppression du compte. Veuillez vérifier votre mot de passe."
				);
			}
		} else {
			setError("Please enter your password.");
		}
	};

	return (
		<View>
			<AccountBlock title="Zone de danger">
				{showPasswordInput ? (
					<>
						<TextInput
							className="h-10 border border-gray-300 mb-4 px-2 w-full"
							placeholder="Enter your password"
							secureTextEntry
							value={password}
							onChangeText={setPassword}
						/>
						{error ? (
							<Text className="text-red-500 mb-4 text-center">{error}</Text>
						) : null}
						<Pressable
							onPress={handleDeleteAccount}
							style={{ backgroundColor: theme.colors.redSecondary }}
							className="px-4 py-2 rounded-xl flex flex-row items-center"
						>
							<Iconify
								icon="material-symbols:warning"
								size={24}
								color={theme.colors.redPrimary}
							/>
							<Text
								className="text-lg text-center ml-1"
								style={{ color: theme.colors.redPrimary }}
							>
								Confirmer la suppression
							</Text>
						</Pressable>
					</>
				) : (
					<View className=" flex items-center justify-center py-5">
						<Pressable
							onPress={() => setShowPasswordInput(true)}
							style={{ backgroundColor: theme.colors.redPrimary }}
							className="px-4 py-2 rounded-3xl w-11/12"
						>
							<Text
								className="text-[16px] text-center font-semibold"
								style={{ color: theme.colors.textSecondary }}
							>
								Supprimer mon compte
							</Text>
						</Pressable>
					</View>
				)}
			</AccountBlock>
		</View>
	);
}