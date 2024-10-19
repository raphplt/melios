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
import CustomTextInput from "@components/Shared/CustomTextInput";

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
					<View className="px-2">
						<CustomTextInput
							label="Confirmer votre mot de passe"
							className="h-10 border border-gray-300 mb-4 px-2 w-full"
							placeholder="Entrez votre mot de passe"
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
							className="px-4 py-2 rounded-xl flex flex-row items-center justify-center"
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
								Supprimer mon compte
							</Text>
						</Pressable>
						<Pressable
							onPress={() => setShowPasswordInput(false)}
							className="px-4 py-2 rounded-xl flex flex-row items-center justify-center mt-4"
							style={{ backgroundColor: theme.colors.backgroundTertiary }}
						>
							<Text
								className="text-lg text-center"
								style={{ color: theme.colors.text }}
							>
								Annuler
							</Text>
						</Pressable>
					</View>
				) : (
					<View className=" flex items-center justify-center py-5">
						<Text className="text-center text-[16px] text-gray-500 mb-4">
							Vous êtes sur le point de supprimer votre compte. Cette action est
							irréversible.
						</Text>
						<Pressable
							onPress={() => setShowPasswordInput(true)}
							style={{ backgroundColor: theme.colors.redPrimary }}
							className="px-4 py-4 rounded-2xl w-11/12"
						>
							<Text className="text-[16px] text-center font-semibold text-white">
								Supprimer mon compte
							</Text>
						</Pressable>
					</View>
				)}
			</AccountBlock>
		</View>
	);
}