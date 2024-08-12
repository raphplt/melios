import { Image, Text, View } from "react-native";

export default function NoHabits({ theme }: { theme: any }) {
	return (
		<View className="flex flex-col py-24 items-center justify-center">
			<Image
				source={require("../../assets/images/illustrations/not_found.png")}
				style={{ width: 250, height: 250, resizeMode: "contain" }}
			/>
			<Text style={{ color: theme.colors.text }} className="text-center mt-6">
				Aucune habitude trouvée. Ajoutez-en une !
			</Text>
		</View>
	);
}
