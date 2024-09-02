import { Habit } from "../../type/habit";
import { firstSteps } from "./firstSteps";

export const runTests = (habitQueue: Habit[]) => {
	const tests = [firstSteps];
	for (const test of tests) {
		try {
			test(habitQueue);
		} catch (e) {
			console.error(e);
		}
	}
};
