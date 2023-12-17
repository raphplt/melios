import { Text, View } from "../../components/Themed";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import ToggleButton from "../../components/Switch";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../db";
import { Button, Pressable, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { disconnectUser } from "../../db/users";

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
					<Button
						title="Logout"
						onPress={() => {
							handleLogout();
						}}
					/>
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
						className="mx-auto bg-blue-500 py-2 px-4 rounded-md"
					>
						<Text style={{ color: theme.colors.text }} className="text-xl">
							Register
						</Text>
					</Pressable>
					<Pressable
						onPress={() => navigation.navigate("login")}
						className="mx-auto bg-green-500 py-2 px-4 rounded-md"
					>
						<Text style={{ color: theme.colors.text }} className="text-xl">
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
