import { ThemeContext } from "@context/ThemeContext";
import { FontAwesome5 } from "@expo/vector-icons";
import { useContext } from "react";
import { View, Text, TextInput, Pressable } from "react-native";

export default function CustomPasswordInput({
	label,
	placeholder,
	value,
	onChangeText,
	error,
	showPassword,
	setShowPassword,
	secureTextEntry = false,
	...props
}: {
	label: string;
	placeholder: string;
	value: string;
	onChangeText: (text: string) => void;
	secureTextEntry?: boolean;
	showPassword: boolean;
	setShowPassword: (value: boolean) => void;
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
			<View
				style={{
					borderColor: error ? theme.colors.redPrimary : theme.colors.border,
				}}
				className="flex flex-row items-center justify-between px-4 w-full mx-auto border rounded-2xl"
			>
				<TextInput
					onChangeText={onChangeText}
					value={value}
					placeholder={placeholder}
					secureTextEntry={!showPassword}
					autoCapitalize="none"
					className=" w-1/2 py-2 "
					placeholderTextColor={theme.colors.grayPrimary}
					cursorColor={theme.colors.text}
				/>
				<Pressable
					onPress={() => setShowPassword(!showPassword)}
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
