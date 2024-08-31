import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Pressable, Text } from "react-native";
import { Iconify } from "react-native-iconify";

export default function ButtonBackRegister({
	setCurrentQuestionIndex,
	currentQuestionIndex,
	form,
	setForm,
}: {
	setCurrentQuestionIndex: any;
	currentQuestionIndex: any;
	form: any;
	setForm: any;
}) {
	const { theme } = useContext(ThemeContext);

	return (
		<Pressable
			onPress={() => {
				setCurrentQuestionIndex(currentQuestionIndex - 1);
				form.pop();
			}}
			className="absolute top-10 left-3 mt-8 ml-8 flex flex-row items-center"
		>
			<Iconify icon="tabler:arrow-left" color={theme.colors.text} size={20} />
			<Text
				style={{ color: theme.colors.text }}
				className="text-center text-[16px] font-semibold ml-2"
			>
				Précédent
			</Text>
		</Pressable>
	);
}
