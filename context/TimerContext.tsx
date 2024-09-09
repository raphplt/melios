import { TimerContextProps } from "@type/timer";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

export const TimerContext = createContext<TimerContextProps>({
	timerSeconds: 0,
	isTimerActive: false,
	isTimerVisible: false,
	setTimerSeconds: function (value: React.SetStateAction<number>): void {},
	setIsTimerActive: function (value: React.SetStateAction<boolean>): void {},
	setIsTimerVisible: function (value: React.SetStateAction<boolean>): void {},
	startTimer: function (): void {},
	pauseTimer: function (): void {},
	stopTimer: function (): void {},
	date: "",
	timerRef: { current: null },
});

export const TimerProvider = ({ children }: { children: ReactNode }) => {
	// States
	const [timerSeconds, setTimerSeconds] = useState(0);
	const [isTimerActive, setIsTimerActive] = useState(false);
	const [isTimerVisible, setIsTimerVisible] = useState(false);
	const [date, setDate] = useState("");
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	return (
		<TimerContext.Provider
			value={{
				timerSeconds,
				isTimerActive,
				isTimerVisible,
				setTimerSeconds,
				setIsTimerActive,
				setIsTimerVisible,
				startTimer: function (): void {},
				pauseTimer: function (): void {},
				stopTimer: function (): void {},
				date,
				timerRef,
			}}
		>
			{children}
		</TimerContext.Provider>
	);
};

export const useTimer = () => {
	const context = useContext(TimerContext);
	if (!context) {
		throw new Error("useTimer must be used within a TimerProvider");
	}
	return context;
};
