import { ThemeContext } from "@context/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useRef } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";

interface CustomPasswordInputProps extends TextInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
}

export default function CustomPasswordInput({
	label,
	placeholder,
	value,
	onChangeText,
	secureTextEntry = false,
	showPassword,
	setShowPassword,
	...props
}: CustomPasswordInputProps) {
	const { theme } = useContext(ThemeContext);
	const textInputRef = useRef<TextInput>(null);

	return (
		<View className="flex flex-col justify-center mt-5 mx-auto">
			<Text
				style={{ color: "rgb(28, 28, 30)" }}
				className="mb-2 ml-2 font-semibold text-[15px]"
			>
				{label}
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.cardBackground,
				}}
				className="flex flex-row items-center justify-between px-5 w-full mx-auto rounded-3xl"
			>
				<TextInput
					ref={textInputRef}
					onChangeText={onChangeText}
					value={value}
					placeholder={placeholder}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					className="w-1/2 py-2"
					placeholderTextColor={theme.colors.grayPrimary}
					cursorColor={theme.colors.text}
					{...props}
					style={{
						color: theme.colors.text,
						backgroundColor: theme.colors.cardBackground,
					}}
				/>
				<Pressable
					onPress={() => {
						setShowPassword(!showPassword);
						textInputRef.current?.focus();
					}}
					className="py-2 px-2"
				>
					<FontAwesome5
						name={showPassword ? "eye-slash" : "eye"}
						size={20}
						color={theme.colors.text}
					/>
				</Pressable>
			</View>
		</View>
	);
}
