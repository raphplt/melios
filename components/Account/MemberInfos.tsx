import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text, Image, Pressable } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Member } from "@type/member";
import getIcon from "@utils/cosmeticsUtils";

export default function MemberInfos({
	member,
	auth,
}: {
	member: Member;
	auth: any;
}) {
	const { theme } = useContext(ThemeContext);
	const navigation: NavigationProp<ParamListBase> = useNavigation();

	return (
		<View style={{ backgroundColor: theme.colors.background }} className="mb-5">
			<View
				className="mx-auto flex flex-col pt-6 justify-center w-11/12 items-center"
				style={{ backgroundColor: theme.colors.background }}
			>
				{member?.profilePicture ? (
					<Image source={getIcon(member.profilePicture)} className="w-36 h-36" />
				) : (
					<Image source={getIcon("man")} className="w-36 h-36" />
				)}

				<View
					className="mx-auto flex flex-col items-center justify-center"
					style={{
						backgroundColor: theme.colors.background,
					}}
				>
					<Text
						className="text-xl mt-3"
						style={{
							color: theme.colors.text,
							fontFamily: "BaskervilleBold",
						}}
					>
						{member?.nom}
					</Text>
					<Text
						className="mb-4 text-[16px] mt-1"
						style={{ color: theme.colors.textTertiary }}
					>
						{auth.currentUser?.email}
					</Text>
					<Pressable
						className="flex flex-row items-center py-3 px-8 rounded-full"
						style={{ backgroundColor: theme.colors.primary }}
						onPress={() => {
							navigation.navigate("editProfil");
						}}
					>
						<Text className="text-[16px] text-white">Éditer le profil</Text>
					</Pressable>
				</View>
			</View>
		</View>
	);
}
