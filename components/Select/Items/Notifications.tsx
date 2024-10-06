import { useTheme } from "@context/ThemeContext";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import ToggleButton from "@components/Account/Switch";

export default function Notifications({
	register,
	setValue,
}: {
	register: any;
	setValue: any;
}) {
	const { theme } = useTheme();
	const [visible, setVisible] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [isSwitchOn, setIsSwitchOn] = useState(false);

	const onChange = (event: any, date: any) => {
		const currentDate = date || selectedDate;
		setVisible(false);
		setSelectedDate(currentDate);
		setValue("reminderTime", currentDate);
	};

	const formatTime = (date: Date) => {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	return (
		<>
			<Text
				style={{
					color: theme.colors.text,
					fontFamily: "BaskervilleBold",
				}}
				className="text-[16px] mt-4 mb-2"
			>
				RAPPEL
			</Text>
			<View
				style={{
					backgroundColor: theme.colors.background,
				}}
				className="rounded-xl py-3 mt-2 flex flex-row items-center justify-around px-2"
			>
				<View className="flex flex-row items-center px-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="mr-4 text-[16px]"
					>
						Me rappeler
					</Text>

					<ToggleButton value={isSwitchOn} onToggle={setIsSwitchOn} />
				</View>
				<View className="flex flex-row items-center px-2">
					<Text
						style={{
							color: theme.colors.text,
						}}
						className="mr-4 text-[16px]"
					>
						à
					</Text>
					<Pressable
						style={{
							backgroundColor: isSwitchOn
								? theme.colors.primary
								: theme.colors.grayPrimary,
						}}
						className="rounded-xl py-2 px-4"
						onPress={() => isSwitchOn && setVisible(true)}
						disabled={!isSwitchOn}
					>
						<Text
							style={{
								color: "white",
							}}
							className="text-[16px]"
						>
							{formatTime(selectedDate)}
						</Text>
					</Pressable>
				</View>
				{visible && isSwitchOn && (
					<RNDateTimePicker mode="time" value={selectedDate} onChange={onChange} />
				)}
			</View>
		</>
	);
}