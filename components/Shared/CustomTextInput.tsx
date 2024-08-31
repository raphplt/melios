import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { View, Text, TextInput } from "react-native";

export default function CustomTextInput({
	label,
	placeholder,
	value,
	onChangeText,
	secureTextEntry = false,
	keyboardType = "default",
	autoCapitalize = "none",
	autoCorrect = false,
	error,
	...props
}: {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
	autoCapitalize?: "none" | "sentences" | "words" | "characters";
	autoCorrect?: boolean;
	error: string;
}) {
	const { theme } = useContext(ThemeContext);
	return (
		<View className="flex flex-col justify-center w-11/12 mt-5 mx-auto">
			<Text
				style={{ color: theme.colors.textTertiary }}
				className="mb-2 ml-1 font-semibold text-[15px]"
			>
				{label}
			</Text>
			<TextInput
				autoFocus={true}
				onChangeText={onChangeText}
				cursorColor={theme.colors.text}
				value={value}
				placeholder={placeholder}
				keyboardType={keyboardType}
				autoCapitalize={autoCapitalize}
				autoCorrect={autoCorrect}
				secureTextEntry={secureTextEntry}
				placeholderTextColor={theme.colors.grayPrimary}
				className=" w-full mx-auto pl-6 pb-1 border py-2 rounded-2xl"
				{...props}
				style={{
					borderColor: error ? theme.colors.redPrimary : theme.colors.border,
				}}
			/>
		</View>
	);
}
