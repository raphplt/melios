import ButtonComplete from "./ButtonComplete";
import ButtonStartHabit from "./ButtonStartHabit";
import Separator from "./Separator";

export default function ButtonsBox() {
	return (
		<>
			<ButtonStartHabit />
			<Separator />
			<ButtonComplete />
		</>
	);
}
