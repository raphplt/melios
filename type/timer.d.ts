export interface TimerContextProps {
	timerSeconds: number;
	isTimerActive: boolean;
	isTimerVisible: boolean;
	setTimerSeconds: React.Dispatch<React.SetStateAction<number>>;
	setIsTimerActive: React.Dispatch<React.SetStateAction<boolean>>;
	setIsTimerVisible: React.Dispatch<React.SetStateAction<boolean>>;
	startTimer: () => void;
	pauseTimer: () => void;
	stopTimer: () => void;
	timerRef: { current: NodeJS.Timeout | null };
}
