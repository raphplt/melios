import { ThemeContext } from "@context/ThemeContext";
import { useContext } from "react";
import { Iconify } from "react-native-iconify";

type IconKey = "ia" | "time" | "check";

export default function IconView({ icon }: { icon: IconKey }) {
	const { theme } = useContext(ThemeContext);

	const iconsList: Record<IconKey, JSX.Element> = {
		ia: <Iconify icon="mage:stars-b" size={24} color={theme.colors.text} />,
		time: <Iconify icon="carbon:time" size={24} color={theme.colors.text} />,
		check: <Iconify icon="ph:check-circle" size={24} color={theme.colors.text} />,
	};

	return iconsList[icon];
}
