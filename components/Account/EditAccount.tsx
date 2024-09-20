import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, Pressable } from "react-native";
import { ThemeContext } from "@context/ThemeContext";
import { updateMemberInfo } from "@db/member";
import AccountBlock from "./AccountBlock";
import { useData } from "@context/DataContext";
import {
	updateEmail,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";
import { auth } from "@db/index";
import { Iconify } from "react-native-iconify";

export default function EditAccount() {
	const { theme } = useContext(ThemeContext);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [initialEmail, setInitialEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const { member, setMember } = useData();

	useEffect(() => {
		if (member?.nom) {
			setName(member.nom);
		}
		if (auth.currentUser?.email) {
			setEmail(auth.currentUser.email);
			setInitialEmail(auth.currentUser.email);
		}
	}, [member]);

	const handleReauthenticate = async () => {
		if (!auth.currentUser?.email) return;
		const credential = EmailAuthProvider.credential(
			auth.currentUser.email,
			password
		);
		try {
			await reauthenticateWithCredential(auth.currentUser, credential);
			return true;
		} catch (error) {
			Alert.alert(
				"Error",
				"Failed to reauthenticate. Please check your password."
			);
			return false;
		}
	};

	const handleUpdateProfile = async () => {
		setLoading(true);
		try {
			await updateMemberInfo(name);
			if (auth.currentUser && email !== initialEmail) {
				const reAuthenticated = await handleReauthenticate();
				if (reAuthenticated) {
					await updateEmail(auth.currentUser, email);
				} else {
					throw new Error("Re authentication failed");
				}
			}
			if (member) setMember({ ...member, nom: name });
			Alert.alert("Succès", "Profil mis à jour avec succès.");
		} catch (error) {
			Alert.alert("Erreur", "Erreur dans la mise à jour du profil");
		} finally {
			setLoading(false);
		}
	};

	return (
		<AccountBlock title="Modifier mon compte">
			<View className="p-4">
				<Text style={{ color: theme.colors.text }} className="mb-1 font-semibold">
					Nom
				</Text>
				<TextInput
					value={name}
					onChangeText={setName}
					style={{ backgroundColor: theme.colors.background }}
					className="h-10  mb-4 px-2 w-full rounded-xl"
				/>

				<Text style={{ color: theme.colors.text }} className="mb-1 font-semibold">
					Email
				</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					style={{ backgroundColor: theme.colors.background }}
					className="h-10  mb-4 px-2 w-full rounded-xl"
				/>

				{email !== initialEmail && (
					<>
						<Text style={{ color: theme.colors.text }} className="mb-1 font-semibold">
							Mot de passe
						</Text>
						<TextInput
							value={password}
							onChangeText={setPassword}
							secureTextEntry
							style={{ backgroundColor: theme.colors.background }}
							className="h-10  mb-4 px-2 w-full rounded-xl"
						/>
						<View
							className="flex flex-row items-center justify-start px-2 w-full rounded-xl my-2 py-2"
							style={{ backgroundColor: theme.colors.backgroundTertiary }}
						>
							<Iconify
								icon="material-symbols:info"
								size={24}
								color={theme.colors.text}
							/>
							<Text className="ml-1 w-3/4" style={{ color: theme.colors.text }}>
								Vous devez entrer votre mot de passe pour mettre à jour votre email.
							</Text>
						</View>
					</>
				)}

				<Pressable
					onPress={handleUpdateProfile}
					disabled={loading}
					style={{ backgroundColor: theme.colors.primary }}
					className="h-10 w-full rounded-xl flex items-center justify-center"
				>
					<Text style={{ color: "white" }}>
						{loading ? "Mise à jour..." : "Mettre à jour"}
					</Text>
				</Pressable>
			</View>
		</AccountBlock>
	);
}
