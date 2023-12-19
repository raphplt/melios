import { Text, View } from "../../components/Themed";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import ToggleButton from "../../components/Switch";
import { onAuthStateChanged } from "firebase/auth";
import { Button, Pressable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { disconnectUser } from "../../db/users";
import { auth } from "../../db";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const [isSignedIn, setIsSignedIn] = useState(false);

	useEffect(() => {
		// Vérifiez si l'utilisateur est connecté lorsque le composant est monté
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsSignedIn(!!user);
		});

		// Nettoyez l'abonnement lorsque le composant est démonté
		return () => unsubscribe();
	}, []);

	const handleToggleTheme = () => {
		toggleTheme();
		setIsDarkTheme((prevState) => !prevState);
	};

	const handleLogout = async () => {
		await disconnectUser();
	};

	const navigation: any = useNavigation();

	return (
		<View
			className="h-[100vh]"
			style={{ backgroundColor: theme.colors.background }}
		>
			{isSignedIn ? (
				<View style={{ backgroundColor: theme.colors.background }}>
					<Text
						className=" ml-6 mb-4 text-xl mt-3"
						style={{ color: theme.colors.text }}
					>
						{auth.currentUser?.email}
					</Text>


					<Pressable
						onPress={handleLogout}
						className="mx-auto bg-red-500 py-2 px-4 rounded-md w-3/4"
					>
						<Text
							style={{ color: theme.colors.text }}
							className="text-lg text-center"
						>
							Déconnexion
						</Text>
					</Pressable>
				</View>
			) : (
				<View style={{ backgroundColor: theme.colors.background }}>
					<Text
						className=" ml-6 mb-4 text-xl mt-3"
						style={{ color: theme.colors.text }}
					>
						Non connecté
					</Text>
					<Pressable
						onPress={() => navigation.navigate("register")}
						className=" bg-blue-500 py-2 px-4 rounded-md w-1/2 mx-auto mb-4 mt-4"
					>
						<Text
							style={{ color: theme.colors.text }}
							className="text-xl text-center"
						>
							Register
						</Text>
					</Pressable>
					<Pressable
						onPress={() => navigation.navigate("login")}
						className="mx-auto bg-green-500 py-2 px-4 rounded-md w-1/2"
					>
						<Text
							style={{ color: theme.colors.text }}
							className="text-xl text-center"
						>
							Login
						</Text>
					</Pressable>
				</View>
			)}
			<Text
				className=" ml-6 mb-4 text-xl mt-3"
				style={{ color: theme.colors.text }}
			></Text>
			<View />
			<View
				className="w-11/12 mx-auto"
				style={{ backgroundColor: theme.colors.background }}
			>
				<ToggleButton
					title="Mode sombre"
					onToggle={handleToggleTheme}
					value={isDarkTheme}
				/>
			</View>
		</View>
	);
}
