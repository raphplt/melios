import { Text, View } from "../../components/Themed";
import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../../components/ThemContext";
import ToggleButton from "../../components/Switch";
import { onAuthStateChanged } from "firebase/auth";
import { Pressable, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { disconnectUser } from "../../db/users";
import { auth } from "../../db";
import { getMemberInfos } from "../../db/member";
import { ScrollView } from "react-native-gesture-handler";

export default function Account() {
	const { theme, toggleTheme } = useContext(ThemeContext);
	const [isDarkTheme, setIsDarkTheme] = useState(theme.dark);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [memberInfos, setMemberInfos] = useState<any>([]);
	const isMounted = useRef(true);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsSignedIn(!!user);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const data = await getMemberInfos();
				setMemberInfos(data);
				setLoading(false);
				console.log("Account - Member infos : ", JSON.stringify(memberInfos));
			} catch (error) {
				handleError(error);
				setMemberInfos([]);
				setLoading(false);
			}
		})();

		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleToggleTheme = () => {
		toggleTheme();
		setIsDarkTheme((prevState) => !prevState);
	};

	const handleLogout = async () => {
		await disconnectUser();
	};

	const navigation: any = useNavigation();

	const handleError = (error: any) => {
		console.log("Index - Erreur lors de la récupération des habitudes : ", error);
	};

	return (
		<ScrollView
			className="h-[100vh]"
			style={{ backgroundColor: theme.colors.background }}
		>
			{isSignedIn ? (
				<View style={{ backgroundColor: theme.colors.background }}>
					<Image
						source={require("../../assets/images/pfp.jpg")}
						className="rounded-full mx-auto mt-4"
						style={{ width: 200, height: 200 }}
					/>

					<Text
						className=" ml-6 mb-4 text-xl mt-3"
						style={{ color: theme.colors.text }}
					>
						{auth.currentUser?.email}
					</Text>
					<Text
						className=" ml-6 mb-4 text-xl mt-3"
						style={{ color: theme.colors.text }}
					>
						{/* {JSON.stringify(memberInfos)} */}
						{memberInfos?.nom}
						{/* {JSON.stringify(memberInfos?.temps)} */}
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
						className=" bg-blue-500 py-2 px-4 rounded-md w-2/3 mx-auto mb-4 mt-4"
					>
						<Text
							style={{ color: theme.colors.text }}
							className="text-xl text-center"
						>
							Inscription
						</Text>
					</Pressable>
					<Pressable
						onPress={() => navigation.navigate("login")}
						className="mx-auto bg-green-500 py-2 px-4 rounded-md w-2/3"
					>
						<Text
							style={{ color: theme.colors.text }}
							className="text-xl text-center"
						>
							Connexion
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
		</ScrollView>
	);
}
