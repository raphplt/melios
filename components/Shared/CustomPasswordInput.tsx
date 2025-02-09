import { ThemeContext } from "@context/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useRef, forwardRef } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";
import { Iconify } from "react-native-iconify";

interface CustomPasswordInputProps extends TextInputProps {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
	textColor?: string;
	returnKeyType?: "done" | "next" | "go" | "search" | "send";
}

const CustomPasswordInput = forwardRef<TextInput, CustomPasswordInputProps>(
	(
		{
			label,
			placeholder,
			value,
			onChangeText,
			secureTextEntry = false,
			showPassword,
			setShowPassword,
			textColor,
			returnKeyType = "done",
			...props
		},
		ref
	) => {
		const { theme } = useContext(ThemeContext);
		const textInputRef = useRef<TextInput>(null);

		return (
			<View className="flex flex-col justify-center mt-4 mx-auto">
				<Text
					style={{ color: textColor || theme.colors.textTertiary }}
					className="mb-2 ml-2"
				>
					{label}
				</Text>
				<View
					className="flex flex-row items-center justify-between px-5 w-full mx-auto rounded-2xl"
					style={{
						borderColor: theme.colors.border,
						borderWidth: 1,
					}}
				>
					<TextInput
						ref={ref || textInputRef}
						onChangeText={onChangeText}
						value={value}
						placeholder={placeholder}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
						className=" py-4 mx-auto rounded-2xl w-10/12"
						placeholderTextColor={theme.colors.grayPrimary}
						cursorColor={theme.colors.text}
						returnKeyType={returnKeyType}
						{...props}
						style={{
							color: theme.colors.text,
						}}
					/>
					<Pressable
						onPress={() => {
							setShowPassword(!showPassword);
							textInputRef.current?.focus();
						}}
						className="py-2 px-2"
					>
						{showPassword ? (
							<Iconify
								icon="mdi:eye-off-outline"
								color={theme.colors.textTertiary}
								size={24}
							/>
						) : (
							<Iconify
								icon="mdi:eye-outline"
								color={theme.colors.textTertiary}
								size={24}
							/>
						)}
					</Pressable>
				</View>
			</View>
		);
	}
);

export default CustomPasswordInput;
