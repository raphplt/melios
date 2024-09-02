import { View, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function DoneToday({ theme }: { theme: any }) {
	return (
		<View
			className="py-3 rounded-lg mt-6 w-11/12 mx-auto"
			style={{
				backgroundColor: theme.colors.blueSecondary,
				borderColor: theme.colors.primary,
			}}
		>
			<Iconify
				icon="gg:check-o"
				size={50}
				color={theme.colors.primary}
				style={{ alignSelf: "center" }}
			/>
			<Text
				className="text-[16px] mt-3 text-center font-bold"
				style={{
					color: theme.colors.primary,
					maxWidth: "90%",
					alignSelf: "center",
				}}
			>
				Vous avez déjà fait cette habitude aujourd'hui
			</Text>
		</View>
	);
}
