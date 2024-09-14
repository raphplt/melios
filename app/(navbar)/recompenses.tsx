import { Text, View } from "react-native";
import { useContext } from "react";
import { Image } from "react-native";
import { Iconify } from "react-native-iconify";
import ViewPoints from "@components/Recompenses/ViewPoints";
import { ThemeContext } from "@context/ThemeContext";

export default function Recompenses() {
	const { theme } = useContext(ThemeContext);

	return (
		<View
			className="min-h-screen"
			style={{
				backgroundColor: theme.colors.background,
			}}
		>
			<View
				className="flex flex-row justify-between items-center my-3 mx-auto rounded-lg py-4 px-3 w-11/12"
				style={{
					backgroundColor: theme.colors.primary,
				}}
			>
				<Text
					className="text-center text-lg"
					style={{
						color: theme.colors.textSecondary,
					}}
				>
					Mes points
				</Text>
				<ViewPoints />
			</View>
			<View
				className="w-11/12 mx-auto rounded-lg py-3 flex flex-row items-center justify-evenly"
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
			>
				<Iconify
					icon="mdi:alert-circle-outline"
					size={28}
					color={theme.colors.primary}
				/>
				<Text
					style={{
						color: theme.colors.text,
					}}
					className="font-semibold w-10/12 text-[16px"
				>
					Les récompenses ne sont pas encore disponibles. Revenez bientôt !
				</Text>
			</View>

			<View
				className="flex flex-col items-center justify-center"
				style={{
					backgroundColor: theme.colors.background,
				}}
			>
				<Image
					source={require("@assets/images/illustrations/not_available.png")}
					alt="Illustration de récompenses non disponibles"
					className="w-3/4 h-3/4"
				/>
			</View>
		</View>
	);
}
