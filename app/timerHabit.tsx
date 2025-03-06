import MainTimer from "@components/TimerHabit/MainTimer";
import { TimerProvider } from "@context/TimerContext";

export default function TimerHabit() {
	return (
		<TimerProvider>
			<MainTimer />
		</TimerProvider>
	);
}
