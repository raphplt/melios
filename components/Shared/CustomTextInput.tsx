import React, { useContext } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { ThemeContext } from "@context/ThemeContext";

interface CustomTextInputProps extends TextInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
}

export default function CustomTextInput({
	label,
	placeholder,
	value,
	onChangeText,
	onFocus,
	...props
}: CustomTextInputProps) {
	const { theme } = useContext(ThemeContext);

	return (
		<View className="flex flex-col justify-center w-11/12 mt-5 mx-auto">
			<Text
				style={{ color: theme.colors.textTertiary }}
				className="mb-2 ml-2 font-semibold text-[15px]"
			>
				{label}
			</Text>
			<TextInput
				onChangeText={onChangeText}
				value={value}
				placeholder={placeholder}
				autoCapitalize="none"
				autoCorrect={false}
				onFocus={onFocus}
				style={{
					borderColor: theme.colors.border,
					color: theme.colors.text,
				}}
				className="px-5 py-2 w-full mx-auto border rounded-3xl"
				placeholderTextColor={theme.colors.grayPrimary}
				cursorColor={theme.colors.text}
				{...props}
			/>
		</View>
	);
}
