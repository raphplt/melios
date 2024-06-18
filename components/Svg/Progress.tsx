import { useContext } from "react";
import Svg, { Rect, Path } from "react-native-svg";
import { ThemeContext } from "../ThemeContext";

export default function Progress({ ...props }) {
	const { theme } = useContext(ThemeContext);
	return (
		<Svg width="25" height="25" viewBox="0 0 25 25" fill="none">
			<Path
				d="M18.6792 8.94879L14.9618 14.5249C14.4485 15.2949 13.2949 15.2231 12.8811 14.3954L12.3038 13.241C11.89 12.4133 10.7364 12.3415 10.2231 13.1114L6.50569 18.6876"
				stroke={theme.colors.primary}
				strokeWidth="2.41035"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<Rect
				x="1.63574"
				y="1.64478"
				width="21.9123"
				height="21.9123"
				rx="2.41035"
				stroke={theme.colors.primary}
				strokeWidth="2.41035"
			/>
		</Svg>
	);
}
