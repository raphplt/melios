import { ThemeContext } from "@context/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useContext, useRef, forwardRef } from "react";
import { View, Text, TextInput, Pressable, TextInputProps } from "react-native";

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
					style={{ color: textColor || "rgb(28, 28, 30)" }}
					className="mb-2 ml-2 font-semibold text-[15px]"
				>
					{label}
				</Text>
				<View
					style={{
						backgroundColor: theme.colors.cardBackground,
					}}
					className="flex flex-row items-center justify-between px-5 w-full mx-auto rounded-2xl"
				>
					<TextInput
						ref={ref || textInputRef}
						onChangeText={onChangeText}
						value={value}
						placeholder={placeholder}
						secureTextEntry={!showPassword}
						autoCapitalize="none"
						className="w-10/12 py-4"
						placeholderTextColor={theme.colors.grayPrimary}
						cursorColor={theme.colors.text}
						returnKeyType={returnKeyType}
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
);

export default CustomPasswordInput;
