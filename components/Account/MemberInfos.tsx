import { updateMemberInfo } from "@db/member";
import { useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";

export default function MemberInfos({
	member,
	auth,
	theme,
}: {
	member: any;
	auth: any;
	theme: any;
}) {
	<View style={{ backgroundColor: theme.colors.background }} className="mb-4">
		<View
			className="mx-auto flex flex-row pt-6 justify-center w-11/12 items-center mb-12"
			style={{ backgroundColor: theme.colors.background }}
		>
			<Image
				source={
					member.profilePicture
						? { uri: member.profilePicture }
						: require("../../assets/images/pfp.jpg")
				}
				className="rounded-full mx-auto mt-4"
				style={{ width: 120, height: 120 }}
			/>
			<View
				className="mx-auto flex flex-col gap-5 max-w-[50%]"
				style={{ backgroundColor: theme.colors.background }}
			>
				<Text
					className=" ml-6 mb-4 text-xl mt-3"
					style={{ color: theme.colors.text }}
				>
					{member?.nom}
				</Text>
				<Text
					className=" ml-6 mb-4 text-lg mt-3"
					style={{ color: theme.colors.text }}
				>
					{auth.currentUser?.email}
				</Text>
			</View>
		</View>
	</View>;
}
