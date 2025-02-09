import React, { useContext } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { ThemeContext, useTheme } from "@context/ThemeContext";

interface CustomTextInputProps extends TextInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	textColor?: string;
	autoFocus?: boolean;
	keyboardType?:
		| "default"
		| "number-pad"
		| "decimal-pad"
		| "numeric"
		| "email-address"
		| "phone-pad";
}

export default function CustomTextInput({
	label,
	placeholder,
	value,
	onChangeText,
	onFocus,
	textColor,
	keyboardType,
	autoFocus,
	...props
}: CustomTextInputProps) {
	const { theme } = useTheme();

	return (
		<View className="flex flex-col justify-center w-full mt-5 mx-auto">
			<Text
				style={{ color: textColor || theme.colors.textTertiary }}
				className="mb-2 ml-2"
			>
				{label}
			</Text>
			<TextInput
				onChangeText={onChangeText}
				value={value}
				keyboardType={keyboardType || "default"}
				placeholder={placeholder}
				autoCapitalize="none"
				autoCorrect={false}
				autoFocus={autoFocus}
				onFocus={onFocus}
				style={{
					color: theme.colors.text,
					borderColor: theme.colors.border,
					borderWidth: 1,
				}}
				className="px-5 py-4 w-full mx-auto rounded-2xl"
				placeholderTextColor={theme.colors.grayPrimary}
				cursorColor={theme.colors.text}
				{...props}
			/>
		</View>
	);
}
