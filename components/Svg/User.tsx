import { useContext } from "react";
import Svg, { Ellipse, Path } from "react-native-svg";
import { ThemeContext } from "../ThemeContext";

export default function User({ ...props }) {
	const { theme } = useContext(ThemeContext);
	return (
		<Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
			<Path
				d="M22.2766 22.5571C21.6627 20.8573 20.3099 19.3554 18.428 18.2841C16.5461 17.2129 14.2403 16.6323 11.8683 16.6323C9.49624 16.6323 7.19046 17.2129 5.30859 18.2841C3.42671 19.3554 2.07389 20.8573 1.45996 22.5571"
				stroke={theme.colors.primary}
				strokeWidth="2"
				strokeLinecap="round"
			/>
			<Ellipse
				cx="11.8682"
				cy="7.25628"
				rx="5.38775"
				ry="5.32916"
				stroke={theme.colors.primary}
				strokeWidth="2"
				strokeLinecap="round"
			/>
		</Svg>
	);
}
