import React, { useContext } from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";
import { ThemeContext } from "@context/ThemeContext";

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
	const { theme } = useContext(ThemeContext);

	return (
		<View className="flex flex-col justify-center w-full mt-5 mx-auto">
			<Text
				style={{ color: textColor || "rgb(28, 28, 30)" }}
				className="mb-2 ml-2 font-semibold text-[16px]"
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
					backgroundColor: theme.colors.cardBackground,
				}}
				className="px-5 py-3 w-full mx-auto rounded-2xl"
				placeholderTextColor={theme.colors.grayPrimary}
				cursorColor={theme.colors.text}
				{...props}
			/>
		</View>
	);
}
