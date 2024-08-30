import { useContext } from "react";
import { ScrollView } from "react-native";
import Version from "@components/Account/Version";
import MemberInfos from "@components/Account/MemberInfos";
import LoaderScreen from "@components/Shared/LoaderScreen";
import { useData } from "@context/DataContext";
import { ThemeContext } from "@context/ThemeContext";
import { auth } from "@db/index";
import General from "@components/Account/General";
import Preferences from "@components/Account/Preferences";

export default function Account() {
	const { theme } = useContext(ThemeContext);

	const { member, isLoading } = useData();

	if (isLoading) return <LoaderScreen text="Chargement du profil" />;

	return (
		<>
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ backgroundColor: theme.colors.background }}
			>
				<MemberInfos member={member} auth={auth} />
				<General />
				<Preferences />

				<Version />
			</ScrollView>
		</>
	);
}
