import BottomButtons from "@components/TimerHabit/BottomButtons";
import BottomContainer from "@components/TimerHabit/BottomContainer";
import ContainerTimerHabit from "@components/TimerHabit/ContainerTimerHabit";
import ImageBox from "@components/TimerHabit/ImageBox";
import ProgressBar from "@components/TimerHabit/ProgressBar";
import { StatusBar } from "react-native";

export default function TimerHabit() {
	return (
		<>
			<ContainerTimerHabit>
				<StatusBar
					barStyle={"light-content"}
					backgroundColor="transparent"
					translucent={true}
				/>
				<ImageBox />
				<BottomContainer>
					<ProgressBar />
					<BottomButtons />
				</BottomContainer>
			</ContainerTimerHabit>
		</>
	);
}
